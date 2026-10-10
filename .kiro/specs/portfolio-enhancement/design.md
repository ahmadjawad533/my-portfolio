# Design Document: Portfolio Enhancement

## Overview

The Portfolio Enhancement feature automates the population of the Projects and Gallery pages by:
1. Fetching public repositories from Ahmad's GitHub profile via the GitHub API
2. Intelligently filtering, deduplicating, and transforming repository data into project cards
3. Scanning workspace images, categorizing them by keywords, and generating captions
4. Organizing images into a structured directory layout with metadata

This design balances **automation** (reducing manual data entry) with **reliability** (graceful degradation on failures) and **maintainability** (clear separation of concerns and reusable utilities).

---

## Architecture Overview

### High-Level Data Flow

```
GitHub API
    ↓
Fetch Repositories
    ↓
Filter & Transform (remove portfolio site, empty descriptions, duplicates)
    ↓
Humanize Names (underscores → spaces, hyphens → spaces, title case)
    ↓
Build PROJECTS entries
    ↓
Projects.jsx PROJECTS array


Workspace Root (images)
    ↓
Scan Image Files
    ↓
Categorize by Keywords (personal, projects, achievements)
    ↓
Generate Captions from Filenames
    ↓
Move to public/gallery/{category}/
    ↓
Build IMAGES object
    ↓
Gallery.jsx IMAGES object
```

### Component Architecture

The implementation is organized into **three utility modules** that are imported and executed during the build process:

```
src/utils/
├── githubProcessor.js      # Fetch & transform GitHub data
├── imageProcessor.js       # Scan, categorize, organize images
└── nameHumanizer.js        # Transform repository names to readable titles
```

Each module exports pure functions that can be:
- **Tested independently** with property-based testing
- **Executed as a build step** via a Node.js script (`scripts/build-portfolio-data.js`)
- **Debugged locally** without side effects

---

## Module Designs

### 1. `githubProcessor.js` — Fetch and Filter GitHub Repositories

**Responsibility:** Query the GitHub API, filter unsuitable repositories, and transform them into project card entries.

**Key Functions:**

#### `async fetchGitHubRepos(username, token)`
- **Input:** GitHub username (string), optional GitHub token (string or null for public API)
- **Output:** Array of repository objects from GitHub API
- **Error Handling:** 
  - Returns empty array if API is unreachable (graceful degradation)
  - Logs detailed error with timestamp and rate limit info
  - Never throws — caller receives `[]` on failure
- **API Details:**
  - Endpoint: `GET https://api.github.com/repos/{username}?per_page=100`
  - Includes pagination handling for users with >100 repos
  - Uses `Accept: application/vnd.github.v3+json` header

#### `filterRepositories(repos, existingProjects, excludedRepoNames)`
- **Input:**
  - `repos`: Array of GitHub repo objects
  - `existingProjects`: Current PROJECTS array (for deduplication)
  - `excludedRepoNames`: Hardcoded array of names to skip (e.g., `['my-portfolio-main']`)
- **Output:** Filtered array of repos meeting inclusion criteria
- **Logic:**
  - ✗ Exclude if `description` is null or empty string or whitespace-only
  - ✗ Exclude if `name` matches excludedRepoNames (case-insensitive)
  - ✗ Exclude if a project with same humanized name already exists (case-insensitive)
  - ✓ Include all others
- **Deduplication Strategy:**
  - Compare repo `html_url` against `code` field in existing projects
  - Compare humanized repo name against existing project `title` (case-insensitive)
  - Log skipped duplicates with reason

#### `transformToProjectEntry(repo)`
- **Input:** Single GitHub repository object (from API)
- **Output:** Project card entry matching PROJECTS schema:
  ```javascript
  {
    title: "Humanized Name",           // from humanizeName(repo.name)
    desc: "Repository description",    // repo.description (trimmed)
    tech: ["Language1", "Language2"],  // extracted from repo.language + topics
    ss: "",                            // empty — screenshot not available
    live: "",                          // empty — live demo not configured
    code: repo.html_url                // https://github.com/.../repo-name
  }
  ```
- **Tech Stack Extraction:**
  - Primary language from `repo.language` field
  - Additional languages from `repo.topics` array (if present)
  - Deduplicate and return as sorted array
  - Default to `[]` if neither available

#### `async buildUpdatedProjects(existingProjects, username, token)`
- **Input:**
  - `existingProjects`: Current PROJECTS array from Projects.jsx
  - `username`: GitHub username
  - `token`: GitHub API token (optional)
- **Output:** New PROJECTS array with existing projects + newly fetched projects
- **Process:**
  1. Fetch repos from GitHub API
  2. Filter unsuitable repos
  3. Transform to project entries
  4. Return `[...existingProjects, ...newProjects]`
  5. Maintain original project order

---

### 2. `imageProcessor.js` — Scan, Categorize, and Organize Images

**Responsibility:** Find all images in workspace, categorize by filename keywords, generate captions, and organize into public/gallery structure.

**Keyword Definitions:**

```javascript
const CATEGORY_KEYWORDS = {
  personal: [
    'personal', 'photo', 'selfie', 'moment', 'me', 'meetup', 
    'recap', 'notification', 'announcement', 'leader', 'advisor', 
    'campus', 'notion'
  ],
  projects: ['project', 'temp jam', 'jam'],
  achievements: [
    'achievement', 'award', 'top', 'captain', 'selection', 
    'finalist', 'finale', 'cloud', 'quest', 'level', 'kiro'
  ]
};

// Priority order (used for conflicts)
const PRIORITY = { achievements: 1, projects: 2, personal: 3 };
```

**Key Functions:**

#### `scanImageFiles(workspaceRoot)`
- **Input:** Workspace root directory path (string)
- **Output:** Array of objects with structure:
  ```javascript
  [
    { filename: "AWS Cloud Club Captain Selection.png", fullPath: "/path/to/file" },
    { filename: "Notion_COMSATS_Lahore_meetup_Selfie.jpeg", fullPath: "/path/to/file" },
    ...
  ]
  ```
- **Image Extensions:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` (case-insensitive)
- **Search Scope:** Workspace root directory only (non-recursive)
- **Error Handling:**
  - Skip files that don't exist or can't be read
  - Log warnings for inaccessible files
  - Continue processing remaining files
  - Never throw

#### `categorizeImage(filename)`
- **Input:** Image filename (string)
- **Output:** Category name (string: `"personal"`, `"projects"`, or `"achievements"`)
- **Logic:**
  1. Normalize filename to lowercase for keyword matching
  2. Check each category's keywords in priority order
  3. Return first category that matches any keyword
  4. If no keywords match, return `"personal"` (fallback)
- **Multi-Match Handling:**
  - If filename matches keywords in multiple categories, use highest priority
  - Example: "Kiro Temp Jam Cloud Quest" → matches projects and achievements → return "achievements"

#### `generateCaption(filename)`
- **Input:** Image filename (string)
- **Output:** Caption object:
  ```javascript
  {
    id: "unique-id-string",         // UUID or hash based on filename
    caption: "Formatted Title",      // from humanizeFilename(filename)
    photos: ["/gallery/category/filename.ext"]  // placeholder — populated after categorization
  }
  ```
- **Caption Processing:**
  - Remove file extension (`.jpg`, `.jpeg`, etc.)
  - Replace underscores with spaces
  - Replace hyphens with spaces
  - Apply title case to each word (capitalize first letter, lowercase rest)
  - Preserve numbers, punctuation, and acronyms as-is
  - Trim whitespace

#### `organizeGalleryImages(workspaceRoot, publicGalleryRoot, imageFiles)`
- **Input:**
  - `workspaceRoot`: Workspace directory path
  - `publicGalleryRoot`: Target root (typically `public/gallery`)
  - `imageFiles`: Array from `scanImageFiles()`
- **Output:** IMAGES object ready for Gallery.jsx:
  ```javascript
  {
    personal: [
      { id: "id1", caption: "Caption 1", photos: ["/gallery/personal/file1.jpg"] },
      ...
    ],
    projects: [...],
    achievements: [...]
  }
  ```
- **File Organization Strategy:**
  1. Create `public/gallery/{personal,projects,achievements}/` directories if they don't exist
  2. For each image file:
     - Determine category via `categorizeImage(filename)`
     - Move file from workspace root to `public/gallery/{category}/filename`
     - Deduplicate: if file already exists in that category, skip (log warning)
     - Generate caption with path pointing to new location
  3. Group captions by category
  4. Return organized IMAGES object
- **Deduplication:**
  - Track seen filenames per category
  - If duplicate encountered, use first occurrence only
  - Log: "Duplicate image 'file.jpg' in category 'personal' — skipping"
- **Error Handling:**
  - Skip files that fail to move (permission denied, source not found)
  - Log: "Failed to move 'file.jpg': [reason]"
  - Continue with next file
  - Return successfully categorized images

#### `buildGalleryObject(imageFiles)`
- **Input:** Categorized and organized image files (array of caption objects grouped by category)
- **Output:** Gallery IMAGES object for Gallery.jsx
- **Ensures:** All three categories present (empty arrays for empty categories)

---

### 3. `nameHumanizer.js` — Transform Repository and Filename Names

**Responsibility:** Convert machine-friendly names into human-readable titles while preserving intent and handling edge cases.

**Key Functions:**

#### `humanizeName(repoName)`
- **Input:** Repository name (string), e.g., `"Tick_Tack_Toe"`, `"AWS-Campus-Help-Assistant"`, `"CRUD-API"`
- **Output:** Human-readable title (string), e.g., `"Tic Tac Toe"`, `"AWS Campus Help Assistant"`, `"CRUD API"`
- **Algorithm:**
  1. Replace underscores with spaces: `Tick_Tack_Toe` → `Tick Tack Toe`
  2. Replace hyphens with spaces: `AWS-Campus-Help-Assistant` → `AWS Campus Help Assistant`
  3. Apply title case transformation:
     - Capitalize first letter of each word (unless already capitalized)
     - Lowercase remaining letters (unless entire word is uppercase acronym)
     - Preserve standalone acronyms: `CRUD` stays `CRUD`, `API` stays `API`
  4. Clean up multiple spaces: `Foo  Bar` → `Foo Bar`
  5. Trim leading/trailing spaces
- **Title Case Logic:**
  - A word is considered an "acronym" if all letters are uppercase and length > 1
  - Acronyms are preserved as-is
  - Other words: capitalize first letter, lowercase rest
  - Examples:
    - `CRUD` → `CRUD` (acronym preserved)
    - `api` → `Api` (title case applied)
    - `API` → `API` (acronym preserved)
    - `aws` → `AWS` (if detected as acronym context, else `Aws`)

#### `ensureUniqueTitle(title, existingProjects, disambiguator = 'v2')`
- **Input:**
  - `title`: Proposed project title (string)
  - `existingProjects`: Current PROJECTS array
  - `disambiguator`: String to append if collision (default: `"v2"`)
- **Output:** Unique title (string)
- **Logic:**
  1. Check if title exists in PROJECTS (case-insensitive comparison)
  2. If no collision, return title as-is
  3. If collision detected:
     - Append ` ({disambiguator})` to title
     - Example: `"CRUD API"` becomes `"CRUD API (v2)"`
     - If still colliding, iterate: `(v3)`, `(v4)`, etc.
  4. Log collision: `"Title collision: 'CRUD API' → 'CRUD API (v2)'"`

---

## Build Script Integration

**File:** `scripts/build-portfolio-data.js`

This is a Node.js script executed during the build process to generate updated project and gallery data:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const githubProcessor = require('../src/utils/githubProcessor');
const imageProcessor = require('../src/utils/imageProcessor');

async function buildPortfolioData() {
  try {
    // 1. Build Projects array from GitHub
    const ProjectsPath = path.join(__dirname, '../src/pages/Projects.jsx');
    const currentProjects = extractProjectsFromFile(ProjectsPath);
    const githubToken = process.env.GITHUB_TOKEN || null;
    
    const updatedProjects = await githubProcessor.buildUpdatedProjects(
      currentProjects,
      'ahmadjawad533',
      githubToken
    );
    
    // Write updated PROJECTS to Projects.jsx
    updateProjectsFile(ProjectsPath, updatedProjects);
    
    // 2. Build Gallery IMAGES from workspace images
    const workspaceRoot = path.join(__dirname, '..');
    const galleryRoot = path.join(__dirname, '../public/gallery');
    
    const imageFiles = imageProcessor.scanImageFiles(workspaceRoot);
    const galleryImages = imageProcessor.organizeGalleryImages(
      workspaceRoot,
      galleryRoot,
      imageFiles
    );
    
    // Write updated IMAGES to Gallery.jsx
    updateGalleryFile(path.join(__dirname, '../src/pages/Gallery.jsx'), galleryImages);
    
    console.log('✅ Portfolio data built successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Build failed:', err.message);
    process.exit(1);
  }
}

buildPortfolioData();
```

**Execution:**
- Add to `package.json` scripts: `"build:portfolio": "node scripts/build-portfolio-data.js"`
- Run before main build: `npm run build:portfolio && npm run build`
- Or integrate into Vite build hook via `vite.config.mjs`

---

## Error Handling Strategy

### Graceful Degradation

| Scenario | Behavior | Result |
|----------|----------|--------|
| GitHub API unreachable | Log error, return existing PROJECTS | Gallery uses old data, no crash |
| Image file missing | Skip file, log warning | Gallery renders with remaining images |
| Invalid filename | Treat as personal category | Image categorized safely |
| Permission denied on move | Log warning, skip image | No crash, continue processing |
| Duplicate image detected | Use first occurrence, log | No duplicates in final output |

### Logging Format

All errors logged with consistent structure:
```
[ERROR] [timestamp] Module: Function
  Context: what was being processed (filename, repo name, etc.)
  Reason: specific error reason
  Action: what the system did (skipped, retried, used fallback)
```

Example:
```
[ERROR] 2024-01-15T10:30:45Z imageProcessor: moveImageFile
  Context: file=/home/jawad/my-portfolio-main/Notion_CAmpus_Leaders_Meetup.jpeg
  Reason: Permission denied (EACCES)
  Action: Skipped image, continuing with remaining files
```

---

## Data Flow Details

### GitHub to Projects.jsx

```
1. Fetch from API
   ↓
2. Filter (empty desc, portfolio site, duplicates)
   ↓
3. Humanize names → "Tic Tac Toe", "AWS Campus Help Assistant"
   ↓
4. Extract tech stack
   ↓
5. Build project entry
   ↓
6. Deduplicate by URL + title
   ↓
7. Return [...existing, ...new]
   ↓
8. Update Projects.jsx PROJECTS array
```

### Images to Gallery.jsx

```
1. Scan workspace for images
   ↓
2. Categorize by keywords (achievements > projects > personal)
   ↓
3. Generate caption from filename
   ↓
4. Move file to public/gallery/{category}/
   ↓
5. Create caption object with new path
   ↓
6. Deduplicate within category
   ↓
7. Group by category
   ↓
8. Update Gallery.jsx IMAGES object
```

---

## Code Structure and File Organization

### Utilities Directory

```
src/utils/
├── githubProcessor.js          (200–250 lines)
│   ├── fetchGitHubRepos()
│   ├── filterRepositories()
│   ├── transformToProjectEntry()
│   └── buildUpdatedProjects()
│
├── imageProcessor.js           (250–350 lines)
│   ├── scanImageFiles()
│   ├── categorizeImage()
│   ├── generateCaption()
│   ├── organizeGalleryImages()
│   └── buildGalleryObject()
│
└── nameHumanizer.js           (100–150 lines)
    ├── humanizeName()
    └── ensureUniqueTitle()
```

### Build Scripts

```
scripts/
├── build-portfolio-data.js    (150–200 lines)
│   ├── buildPortfolioData()
│   ├── extractProjectsFromFile()
│   └── updateProjectsFile()
│   └── updateGalleryFile()
└── (integrate into Vite config for CI/CD)
```

### Updated Component Files

```
src/pages/
├── Projects.jsx               (updated PROJECTS array)
└── Gallery.jsx                (updated IMAGES object)
```

### Public Directory

```
public/
└── gallery/
    ├── personal/              (auto-organized)
    │   ├── file1.jpg
    │   └── file2.jpeg
    ├── projects/              (auto-organized)
    │   └── temp-jam-3.jpeg
    └── achievements/          (auto-organized)
        └── aws-cloud-club-captain-selection.png
```

---

## Integration Points

### 1. Projects.jsx Integration

The component imports and uses the updated PROJECTS array (no code change required, only data):

```javascript
// Projects.jsx — no change to component logic
const PROJECTS = [
  // ... existing projects (unchanged)
  // ... new projects from GitHub API (appended by build script)
];
```

### 2. Gallery.jsx Integration

The component imports and uses the updated IMAGES object (no code change required, only data):

```javascript
// Gallery.jsx — no change to component logic
const IMAGES = {
  personal: [...],       // populated from workspace images
  projects: [...],
  achievements: [...]
};
```

### 3. Build System Integration

Add to `vite.config.mjs`:

```javascript
import { execSync } from 'child_process';

export default {
  plugins: [
    {
      name: 'build-portfolio-data',
      apply: 'build',
      enforce: 'pre',
      buildStart: async () => {
        console.log('🔄 Generating portfolio data...');
        try {
          execSync('node scripts/build-portfolio-data.js', { 
            stdio: 'inherit',
            env: { ...process.env, GITHUB_TOKEN: process.env.GITHUB_TOKEN }
          });
        } catch (err) {
          console.warn('⚠️  Portfolio data build skipped (non-fatal)');
        }
      }
    }
  ]
};
```

### 4. Environment Variables

Required for GitHub API authentication:
- `GITHUB_TOKEN`: Optional GitHub personal access token (for higher rate limits)
  - Without token: 60 requests/hour (public API)
  - With token: 5000 requests/hour (public API with auth)
  - Generate at https://github.com/settings/tokens (select `public_repo` scope)

---

## Testing Strategy

### Unit Tests (Property-Based)

Using [fast-check](https://www.npmjs.com/package/fast-check) or similar:

```javascript
// Example: test humanizeName()
describe('nameHumanizer', () => {
  it('converts underscores to spaces and applies title case', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const result = humanizeName(input);
        // Property: no underscores in output
        expect(result).not.toContain('_');
        // Property: result is non-empty if input is non-empty
        if (input.length > 0) expect(result.length).toBeGreaterThan(0);
      })
    );
  });
});
```

### Integration Tests

Manual or CI/CD tests:
- Mock GitHub API responses with sample repos
- Verify Projects.jsx is updated with correct data
- Verify Gallery.jsx IMAGES object has correct structure
- Verify images are moved to correct directories

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: GitHub Filtering Removes Empty Descriptions

*For any* repository list, after filtering, no repository with an empty or whitespace-only description shall be included in the result.

**Validates: Requirements 1.3**

### Property 2: Portfolio Site Self-Exclusion

*For any* repository list, repositories named 'my-portfolio-main' (case-insensitive) shall never be included in filtered results regardless of their description or other attributes.

**Validates: Requirements 1.4**

### Property 3: Existing Project Deduplication

*For any* set of existing projects and newly fetched repositories, no project with the same repository URL shall appear twice in the combined result.

**Validates: Requirements 1.2, 6.1**

### Property 4: Project Title Humanization Consistency

*For any* repository name, repeated application of the humanization function shall produce identical results (idempotence).

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 5: Unique Title Generation

*For any* proposed title and existing projects array, `ensureUniqueTitle()` shall return a title that does not match any existing project title (case-insensitive).

**Validates: Requirements 2.4, 6.2**

### Property 6: Personal Category Keyword Detection

*For any* image filename containing personal category keywords ('personal', 'photo', 'selfie', etc., case-insensitive), the categorization function shall return 'personal'.

**Validates: Requirements 3.2**

### Property 7: Projects Category Keyword Detection

*For any* image filename containing projects category keywords ('project', 'jam', etc., case-insensitive), the categorization function shall return 'projects'.

**Validates: Requirements 3.3**

### Property 8: Achievements Category Keyword Detection

*For any* image filename containing achievements category keywords ('award', 'cloud', 'quest', etc., case-insensitive), the categorization function shall return 'achievements'.

**Validates: Requirements 3.4**

### Property 9: Category Priority Ordering

*For any* image filename matching keywords in multiple categories, the category returned shall be the highest-priority match (achievements > projects > personal).

**Validates: Requirements 3.5**

### Property 10: Default Category Fallback

*For any* image filename not matching any category keywords, the categorization function shall return 'personal'.

**Validates: Requirements 3.6**

### Property 11: Caption Extension Removal

*For any* image filename with a recognized extension (.jpg, .jpeg, .png, .gif, .webp), the caption shall not contain that extension.

**Validates: Requirements 4.1**

### Property 12: Underscore-to-Space Caption Conversion

*For any* image filename containing underscores, the generated caption shall replace all underscores with spaces.

**Validates: Requirements 4.3**

### Property 13: Caption Title Case Formatting

*For any* image filename, the generated caption shall have the first letter of each word capitalized and subsequent letters lowercase (except for recognized acronyms).

**Validates: Requirements 4.3**

### Property 14: Caption Object Structure

*For any* image file, the generated caption object shall contain exactly three fields: `id` (unique string), `caption` (formatted title string), and `photos` (array of path strings).

**Validates: Requirements 4.5**

### Property 15: Gallery Image Path Format

*For any* organized gallery image, the path in the IMAGES object shall follow the format `/gallery/{category}/{filename}` where category is one of 'personal', 'projects', or 'achievements'.

**Validates: Requirements 5.3**

### Property 16: Image Deduplication Within Category

*For any* image scan result with duplicate filenames in the same category, the final IMAGES object shall contain each filename only once per category.

**Validates: Requirements 6.4**

### Property 17: Invalid File Extension Handling

*For any* file in the workspace root that lacks a recognized image extension, it shall be skipped during image scanning and not appear in the final IMAGES object.

**Validates: Requirements 7.4**

### Property 18: Project Entry Schema Compliance

*For any* transformed repository, the resulting project entry shall contain exactly these fields with correct types: `title` (string), `desc` (string), `tech` (array), `ss` (empty string), `live` (empty string), `code` (URL string).

**Validates: Requirements 1.6**

---

## Maintenance and Extensibility

### How to Add New Categories (Future)

1. Add keywords to `CATEGORY_KEYWORDS` in `imageProcessor.js`
2. Update `PRIORITY` object if needed
3. Add category name to IMAGES object initialization
4. Re-run build script

### How to Manually Override Auto-Generated Data

**Projects:**
Edit `src/pages/Projects.jsx` directly. Manually added projects persist across builds.

**Gallery:**
Edit `src/pages/Gallery.jsx` directly. Manually added captions persist; auto-generated ones update on build.

### How to Disable Automation

**GitHub Projects:** Remove build script execution → use static PROJECTS array only
**Gallery Images:** Remove image processor → use static IMAGES array only

---

## Summary

The Portfolio Enhancement feature combines automated data fetching and processing with graceful error handling and careful deduplication. By separating concerns into focused utility modules, the design enables:

- **Testability:** Pure functions with clear inputs/outputs
- **Maintainability:** Modular utilities easy to debug and extend
- **Reliability:** Graceful degradation prevents partial failures from breaking the site
- **Performance:** Build-time processing (no runtime overhead)
- **Flexibility:** Easy to customize categories, keywords, and naming rules

