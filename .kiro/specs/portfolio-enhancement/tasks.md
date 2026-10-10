# Implementation Plan: Portfolio Enhancement

## Overview

This plan breaks down the portfolio enhancement feature into discrete, testable implementation tasks. The feature automates the population of the Projects and Gallery pages by fetching GitHub repositories, processing workspace images, and organizing them into structured data. Each task builds incrementally and integrates into the next step.

The implementation follows a layered approach:
1. **Foundation**: Utility modules and build infrastructure
2. **Data Processing**: GitHub and image processing logic
3. **Integration**: Wiring into the build system and React components
4. **Validation**: Testing and verification

---

## Tasks

- [x] 1. Set up project structure and core build infrastructure
  - Create `src/utils/` directory structure
  - Create `scripts/` directory for build scripts
  - Set up build script with Node.js entry point and basic error handling
  - Add build script to `package.json` scripts section
  - Create `.env` template documentation for `GITHUB_TOKEN`
  - _Requirements: 1.1, 7.1_

- [x] 2. Implement the Name Humanizer utility module
  - [x] 2.1 Create `src/utils/nameHumanizer.js` with core structure
    - Export `humanizeName()` and `ensureUniqueTitle()` functions
    - Add comprehensive JSDoc comments explaining each function
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 Implement `humanizeName()` function
    - Replace underscores with spaces
    - Replace hyphens with spaces
    - Implement title case transformation (capitalize first letter, preserve acronyms)
    - Clean up multiple spaces and trim whitespace
    - Handle edge cases: empty strings, single characters, all-caps acronyms
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 2.3 Write property tests for `humanizeName()`
    - **Property 4: Project Title Humanization Consistency** — test idempotence
    - **Validates: Requirements 2.1, 2.2, 2.3**
    - Test that repeated calls produce identical results
    - Test outputs contain no underscores or hyphens

  - [x] 2.4 Implement `ensureUniqueTitle()` function
    - Check for title collisions in existing projects (case-insensitive)
    - Append disambiguator (v2, v3, etc.) on collision
    - Log collision detection
    - Handle edge cases: null/undefined inputs, empty arrays
    - _Requirements: 2.4_

  - [x] 2.5 Write property tests for `ensureUniqueTitle()`
    - **Property 5: Unique Title Generation** — test collision detection
    - **Validates: Requirements 2.4, 6.2**
    - Verify returned title never matches existing (case-insensitive)
    - Test multiple collisions generate unique v2, v3, etc.

- [x] 3. Implement the GitHub Processor utility module
  - [x] 3.1 Create `src/utils/githubProcessor.js` with core structure
    - Export all four main functions with JSDoc
    - Implement constants: API endpoint, headers, excluded repos list
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 3.2 Implement `fetchGitHubRepos()` function
    - Build GitHub API URL for username with pagination support
    - Use optional GitHub token if provided (from env or parameter)
    - Fetch with proper headers and error handling
    - Return empty array on API failure (graceful degradation)
    - Log errors with timestamp and context
    - Handle rate limit responses (429 status)
    - _Requirements: 1.1, 7.1, 7.3_

  - [x] 3.3 Implement `filterRepositories()` function
    - Filter out repos with empty/whitespace descriptions
    - Filter out portfolio site ('my-portfolio-main' case-insensitive)
    - Filter out duplicates by URL matching with existing projects
    - Filter out duplicates by humanized name (case-insensitive)
    - Log each filtered repo with reason
    - _Requirements: 1.2, 1.3, 1.4, 6.1, 6.2_

  - [x] 3.4 Implement `transformToProjectEntry()` function
    - Map GitHub repo to project card schema (title, desc, tech, ss, live, code)
    - Use `humanizeName()` for title formatting
    - Extract tech stack from language + topics fields
    - Handle missing language or topics (return empty array)
    - Validate output schema before returning
    - _Requirements: 1.5, 1.6, 2.1_

  - [x] 3.5 Write property tests for GitHub filtering and transformation
    - **Property 1: GitHub Filtering Removes Empty Descriptions** — filter removes empty descriptions
    - **Validates: Requirements 1.3**
    - **Property 2: Portfolio Site Self-Exclusion** — excludes my-portfolio-main
    - **Validates: Requirements 1.4**
    - **Property 3: Existing Project Deduplication** — no duplicate URLs
    - **Validates: Requirements 1.2, 6.1**
    - **Property 18: Project Entry Schema Compliance** — validates output structure
    - **Validates: Requirements 1.6**

  - [x] 3.6 Implement `buildUpdatedProjects()` function
    - Call `fetchGitHubRepos()` to get repos from API
    - Call `filterRepositories()` to clean and deduplicate
    - Transform filtered repos using `transformToProjectEntry()`
    - Return combined array: [...existingProjects, ...newProjects]
    - Maintain original project order
    - _Requirements: 1.1, 1.2_

- [x] 4. Implement the Image Processor utility module
  - [x] 4.1 Create `src/utils/imageProcessor.js` with core structure
    - Export all five main functions with JSDoc
    - Define CATEGORY_KEYWORDS and PRIORITY constants
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [x] 4.2 Implement `scanImageFiles()` function
    - Scan workspace root for image files only (non-recursive)
    - Filter by extensions: .jpg, .jpeg, .png, .gif, .webp (case-insensitive)
    - Return array of objects with filename and fullPath
    - Log errors for inaccessible files
    - Never throw on file access errors
    - _Requirements: 7.4_

  - [x] 4.3 Implement `categorizeImage()` function
    - Normalize filename to lowercase for keyword matching
    - Check keywords in priority order (achievements > projects > personal)
    - Return first matching category or "personal" as fallback
    - Handle multi-match by priority
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 4.4 Write property tests for image categorization
    - **Property 6: Personal Category Keyword Detection** — detects personal keywords
    - **Validates: Requirements 3.2**
    - **Property 7: Projects Category Keyword Detection** — detects projects keywords
    - **Validates: Requirements 3.3**
    - **Property 8: Achievements Category Keyword Detection** — detects achievements keywords
    - **Validates: Requirements 3.4**
    - **Property 9: Category Priority Ordering** — prioritizes correctly on multi-match
    - **Validates: Requirements 3.5**
    - **Property 10: Default Category Fallback** — returns personal as fallback
    - **Validates: Requirements 3.6**

  - [x] 4.5 Implement `generateCaption()` function
    - Remove file extension from filename
    - Replace underscores with spaces
    - Replace hyphens with spaces
    - Apply title case transformation
    - Generate unique ID (UUID or filename hash)
    - Return caption object with id, caption, photos fields
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 4.6 Write property tests for caption generation
    - **Property 11: Caption Extension Removal** — no extensions in captions
    - **Validates: Requirements 4.1**
    - **Property 12: Underscore-to-Space Caption Conversion** — underscores replaced
    - **Validates: Requirements 4.3**
    - **Property 13: Caption Title Case Formatting** — title case applied correctly
    - **Validates: Requirements 4.3**
    - **Property 14: Caption Object Structure** — correct fields present
    - **Validates: Requirements 4.5**

  - [x] 4.7 Implement `organizeGalleryImages()` function
    - Create public/gallery/{category}/ directories if needed
    - For each image file:
      - Determine category via `categorizeImage()`
      - Move file to public/gallery/{category}/filename
      - Generate caption with new path
      - Deduplicate within category (skip if already exists)
    - Build IMAGES object grouped by category
    - Log warnings for failed moves or duplicates
    - Never throw on file operation failures
    - _Requirements: 5.1, 5.2, 5.3, 6.4, 7.2, 7.5_

  - [x] 4.8 Write property tests for image organization
    - **Property 15: Gallery Image Path Format** — paths follow /gallery/{category}/{filename}
    - **Validates: Requirements 5.3**
    - **Property 16: Image Deduplication Within Category** — no duplicates per category
    - **Validates: Requirements 6.4**
    - **Property 17: Invalid File Extension Handling** — non-image files skipped
    - **Validates: Requirements 7.4**

  - [x] 4.9 Implement `buildGalleryObject()` function
    - Take array of organized image files
    - Group captions by category
    - Ensure all three categories present (empty arrays for empty categories)
    - Return IMAGES object ready for Gallery.jsx
    - Validate output structure
    - _Requirements: 5.1, 6.4_

- [x] 5. Checkpoint - Verify utility modules are complete and tested
  - Run all unit tests and property tests
  - Verify no console errors
  - Check that all 18 correctness properties pass
  - Ask the user if questions arise.

- [x] 6. Implement the build script orchestrator
  - [x] 6.1 Create `scripts/build-portfolio-data.js` with main orchestration
    - Implement `buildPortfolioData()` async main function
    - Set up error handling and exit codes
    - Load environment variables (GITHUB_TOKEN)
    - _Requirements: 1.1, 6.3_

  - [x] 6.2 Implement project file extraction and update logic
    - Create `extractProjectsFromFile()` to parse Projects.jsx
    - Create `updateProjectsFile()` to write updated PROJECTS
    - Handle file read/write errors gracefully
    - Preserve file formatting and comments
    - _Requirements: 8.3_

  - [x] 6.3 Implement gallery file extraction and update logic
    - Create `extractGalleryFromFile()` to parse Gallery.jsx
    - Create `updateGalleryFile()` to write updated IMAGES
    - Handle file read/write errors gracefully
    - Preserve file formatting and comments
    - _Requirements: 8.3_

  - [x] 6.4 Wire GitHub processor into build script
    - Call `buildUpdatedProjects()` with existing PROJECTS
    - Update Projects.jsx with new PROJECTS array
    - Log summary of added projects
    - _Requirements: 1.1, 1.2, 8.1_

  - [x] 6.5 Wire image processor into build script
    - Call `scanImageFiles()` and `organizeGalleryImages()`
    - Update Gallery.jsx with new IMAGES object
    - Log summary of organized images
    - _Requirements: 3.1, 5.1, 8.1_

  - [x] 6.6 Add shebang and make script executable
    - Add `#!/usr/bin/env node` shebang to build script
    - Set executable permissions
    - _Requirements: 8.1_

- [x] 7. Integrate build script into package.json
  - [x] 7.1 Add build:portfolio script to package.json
    - Add script: `"build:portfolio": "node scripts/build-portfolio-data.js"`
    - _Requirements: 8.1_

  - [x] 7.2 Update build script to handle GITHUB_TOKEN
    - Pass environment variables to subprocess
    - Document token requirement in README or inline
    - _Requirements: 1.1, 8.2_

- [x] 8. Integrate portfolio data build into Vite build system
  - [x] 8.1 Update `vite.config.mjs` to add build hook
    - Create plugin that runs `build-portfolio-data.js` as pre-build step
    - Handle non-fatal failures gracefully (warn instead of fail)
    - Use `execSync()` with proper error handling
    - Pass GITHUB_TOKEN to subprocess
    - _Requirements: 8.1_

  - [x] 8.2 Test Vite integration
    - Run `npm run build` and verify portfolio data is generated
    - Verify Projects.jsx is updated with new projects
    - Verify Gallery.jsx is updated with new images
    - _Requirements: 1.1, 5.1_

- [x] 9. Update Projects.jsx with auto-generated data
  - [x] 9.1 Review current Projects.jsx structure
    - Understand current PROJECTS array format
    - Identify where new projects should be inserted
    - _Requirements: 1.5, 8.3_

  - [x] 9.2 Verify auto-generated projects are added
    - Check that build script successfully populated new entries
    - Verify field mappings match expected schema
    - Verify no duplicates exist in final array
    - _Requirements: 1.6, 6.1, 6.2_

  - [x] 9.3 Add inline documentation
    - Comment explaining PROJECTS array structure
    - Comment explaining how to add manual projects
    - Comment explaining auto-generated entries
    - _Requirements: 8.3_

- [x] 10. Update Gallery.jsx with auto-generated images
  - [x] 10.1 Review current Gallery.jsx structure
    - Understand current IMAGES object format
    - Identify where new categories should fit
    - _Requirements: 5.1, 8.3_

  - [x] 10.2 Verify auto-generated images are added
    - Check that build script successfully populated IMAGES
    - Verify all three categories present
    - Verify image paths point to correct locations
    - _Requirements: 5.1, 5.3, 6.4_

  - [x] 10.3 Add inline documentation
    - Comment explaining IMAGES object structure
    - Comment explaining how to add manual captions
    - Comment explaining auto-generated entries
    - Comment showing example entry structure
    - _Requirements: 8.2, 8.3_

- [x] 11. Organize workspace images into public/gallery/ structure
  - [x] 11.1 Create public/gallery/ directory structure
    - Create `public/gallery/personal/` directory
    - Create `public/gallery/projects/` directory
    - Create `public/gallery/achievements/` directory
    - _Requirements: 5.1_

  - [x] 11.2 Run build script to populate gallery images
    - Execute `npm run build:portfolio` to organize images
    - Verify images moved to correct category directories
    - Verify filenames preserved
    - _Requirements: 5.2, 5.3_

  - [x] 11.3 Verify gallery images are correctly categorized
    - Spot-check images in each category match expected keywords
    - Verify no duplicate images exist per category
    - Verify captions match filename patterns
    - _Requirements: 3.2, 3.3, 3.4, 5.3, 6.4_

- [x] 12. Create .env setup documentation
  - [x] 12.1 Create or update .env.example file
    - Add `GITHUB_TOKEN=` placeholder
    - Add comment explaining rate limits (60 vs 5000 requests/hour)
    - Add comment showing where to generate token (GitHub settings)
    - _Requirements: 1.1, 8.2_

  - [x] 12.2 Update README with setup instructions
    - Document optional GITHUB_TOKEN setup
    - Explain how to run `npm run build:portfolio` manually
    - Explain how to integrate into CI/CD (GitHub Actions example)
    - _Requirements: 8.2_

- [x] 13. Checkpoint - Integration and manual testing
  - Run the full build process: `npm run build:portfolio`
  - Verify no errors in console output
  - Check Projects.jsx has new projects from GitHub
  - Check Gallery.jsx has new images from workspace
  - Verify all tests pass
  - Ask the user if questions arise.

- [x] 14. Add comprehensive error handling and logging
  - [x] 14.1 Enhance error messages across all modules
    - Add context to every error log (filename, category, reason, action)
    - Use consistent timestamp format (ISO 8601)
    - Include module name in every log
    - _Requirements: 7.3, 7.4_

  - [x] 14.2 Test error scenarios manually
    - Test with invalid GITHUB_TOKEN
    - Test with missing workspace images
    - Test with corrupted image files
    - Test with API rate limiting
    - Verify graceful degradation in each case
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 15. Add comprehensive inline documentation and comments
  - [x] 15.1 Document all utility modules
    - Add file-level JSDoc explaining module purpose and exports
    - Add function-level JSDoc for all public functions
    - Include parameter types and return types
    - Include example usage for key functions
    - _Requirements: 8.3_

  - [x] 15.2 Document build script
    - Add section comments explaining each phase
    - Document environment variables and their effects
    - Add example output scenarios
    - _Requirements: 8.2, 8.3_

  - [x] 15.3 Document component updates
    - Add comments in Projects.jsx explaining PROJECTS structure
    - Add comments in Gallery.jsx explaining IMAGES structure
    - Show how to manually add entries
    - _Requirements: 8.2, 8.3_

- [x] 16. Final integration test
  - [x] 16.1 Run full build process end-to-end
    - Execute `npm run build:portfolio`
    - Execute `npm run build`
    - Verify no errors
    - Verify Projects page displays new projects
    - Verify Gallery page displays new organized images
    - _Requirements: 1.1, 5.1, 8.1_

  - [x] 16.2 Test graceful degradation scenarios
    - Comment out GITHUB_TOKEN, run build, verify portfolio still works
    - Remove some images, run build, verify no crash
    - Simulate API error, verify fallback to existing projects
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 17. Final checkpoint - All tests pass
  - Run all unit tests and property tests
  - Run integration tests
  - Verify portfolio builds successfully
  - Verify no console errors or warnings (except expected deprecations)
  - Ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP. However, skipping tests may reduce confidence in correctness.
- All utility modules are pure functions with no side effects (except logging), making them highly testable.
- The build script orchestrates these utilities and handles file I/O — this is where side effects occur.
- Each task references specific requirements for complete traceability.
- Property-based tests validate universal correctness properties from the design document.
- Error handling is a cross-cutting concern — every function that could fail should log and gracefully degrade.
- Checkpoints ensure incremental validation and catch integration issues early.

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["2.2", "3.1"] },
    { "id": 2, "tasks": ["2.3", "2.4", "3.2"] },
    { "id": 3, "tasks": ["2.5", "3.3", "3.4", "4.1"] },
    { "id": 4, "tasks": ["3.5", "3.6", "4.2"] },
    { "id": 5, "tasks": ["4.3", "4.4", "6.1"] },
    { "id": 6, "tasks": ["4.5", "4.6", "6.2"] },
    { "id": 7, "tasks": ["4.7", "4.8", "6.3"] },
    { "id": 8, "tasks": ["4.9", "6.4", "6.5"] },
    { "id": 9, "tasks": ["6.6", "7.1"] },
    { "id": 10, "tasks": ["7.2", "8.1"] },
    { "id": 11, "tasks": ["8.2", "9.1"] },
    { "id": 12, "tasks": ["9.2", "9.3", "10.1"] },
    { "id": 13, "tasks": ["10.2", "10.3", "11.1"] },
    { "id": 14, "tasks": ["11.2", "11.3", "12.1"] },
    { "id": 15, "tasks": ["12.2", "14.1"] },
    { "id": 16, "tasks": ["14.2", "15.1"] },
    { "id": 17, "tasks": ["15.2", "15.3"] }
  ]
}
```

