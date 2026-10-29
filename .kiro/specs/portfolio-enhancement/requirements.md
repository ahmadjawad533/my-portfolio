# Requirements Document: Portfolio Enhancement

## Introduction

This feature enhances the portfolio website by populating the Projects page with all GitHub repositories from the user's profile (github.com/ahmadjawad533) that are not already listed, and organizing gallery images by category with auto-generated captions and metadata. The goal is to create a comprehensive showcase of work and achievements while reducing manual data entry through intelligent image categorization.

## Glossary

- **Portfolio Website**: The React + Vite application serving as Ahmad Jawad's portfolio
- **GitHub Profile**: The user's GitHub account at github.com/ahmadjawad533 containing all repositories to be sourced
- **Projects Page**: The Projects.jsx component displaying a grid of project cards with title, description, tech stack, and links
- **Gallery Component**: The Gallery.jsx component displaying categorized images with zoom functionality
- **Image Categories**: Three distinct groupings: personal (photos and personal moments), projects (screenshots and project-related images), achievements (awards, certificates, and accomplishments)
- **Caption**: User-friendly title extracted and formatted from the image filename
- **Project Card**: A visual component displaying project metadata including title, description, tech stack, and action buttons
- **Repository**: A GitHub project containing source code and documentation
- **Active Repository**: A GitHub repository with a description (non-empty) indicating it is a completed or active project worth showcasing
- **Excluded Repository**: Repositories that should not be added (e.g., portfolio site itself, forks, archives, or duplicates of existing projects)

## Requirements

### Requirement 1: Fetch and Filter GitHub Projects

**User Story:** As a portfolio visitor, I want to see all of Ahmad's public GitHub projects so I can understand the full scope of his work and expertise.

#### Acceptance Criteria

1. WHEN the portfolio build runs, THE GitHub Fetcher SHALL query github.com/ahmadjawad533 for all public repositories using the GitHub API
2. WHEN repositories are fetched, THE GitHub Fetcher SHALL filter out repositories that are already present in the Projects.jsx PROJECTS array (using case-insensitive title matching)
3. WHEN a repository is evaluated for inclusion, THE GitHub Fetcher SHALL exclude it IF the description is empty (missing or blank string)
4. WHEN a repository is evaluated for inclusion, THE GitHub Fetcher SHALL exclude it IF the repository name is 'my-portfolio-main' (the portfolio site itself)
5. WHEN the GitHub API responds with an error or timeout, THE GitHub Fetcher SHALL log the error with clear messaging and gracefully skip the repository (not fail the entire build)
6. WHEN repositories are successfully filtered, THE GitHub Fetcher SHALL generate a new PROJECTS array entry for each repository with fields: title (repository name humanized), desc (repository description), tech (language array extracted from GitHub), ss (empty string), live (empty string), code (repository URL)

### Requirement 2: Humanize Repository Names for Project Titles

**User Story:** As a portfolio visitor, I want project titles to be readable and professional, not raw repository slugs.

#### Acceptance Criteria

1. WHEN a repository name like 'Tick_Tack_Toe' is encountered, THE Name Converter SHALL format it as 'Tic Tac Toe' (convert underscores to spaces, apply title case)
2. WHEN a repository name like 'AWS-Campus-Help-Assistant' is encountered, THE Name Converter SHALL format it as 'AWS Campus Help Assistant' (convert hyphens to spaces, preserve acronyms, apply title case)
3. WHEN a repository name like 'CRUD-API' is encountered, THE Name Converter SHALL format it as 'CRUD API' (preserve all-caps acronyms as standalone words, apply title case to remaining words)
4. IF a formatted name already exists in the PROJECTS array (case-insensitive), THEN THE Name Converter SHALL append a disambiguator such as ' (v2)' or repository-specific context to create a unique title

### Requirement 3: Organize Gallery Images by Category

**User Story:** As a portfolio visitor, I want to browse organized gallery images that showcase Ahmad's personal moments, project work, and achievements.

#### Acceptance Criteria

1. WHEN the Gallery component loads, THE Image Organizer SHALL categorize all image files (JPG, JPEG, PNG, GIF, WebP) from the workspace root directory into three categories: personal, projects, achievements
2. WHEN an image filename contains any of these keywords (case-insensitive): 'personal', 'photo', 'selfie', 'moment', 'me', 'meetup', 'recap', 'notification', 'announcement', 'leader', 'advisor', 'campus', 'notion' THEN THE Image Organizer SHALL place it in the 'personal' category
3. WHEN an image filename contains any of these keywords (case-insensitive): 'project', 'temp jam', 'jam' THEN THE Image Organizer SHALL place it in the 'projects' category
4. WHEN an image filename contains any of these keywords (case-insensitive): 'achievement', 'award', 'top', 'captain', 'selection', 'finalist', 'finale', 'cloud', 'quest', 'level', 'kiro' THEN THE Image Organizer SHALL place it in the 'achievements' category
5. IF an image filename matches keywords in multiple categories, THEN THE Image Organizer SHALL prioritize in this order: achievements > projects > personal (using the highest-priority category)
6. IF an image does not match any category keywords, THEN THE Image Organizer SHALL place it in the 'personal' category as the default fallback

### Requirement 4: Generate Captions and Metadata from Filenames

**User Story:** As a portfolio visitor, I want each gallery image to have a clear, descriptive caption extracted from the filename.

#### Acceptance Criteria

1. WHEN an image filename is processed, THE Caption Generator SHALL remove file extensions (.jpg, .jpeg, .png, etc.)
2. WHEN an image filename like 'AWS Cloud Club Captain Selection.png' is processed, THE Caption Generator SHALL format it as 'AWS Cloud Club Captain Selection' (remove extension, preserve original spacing and capitalization)
3. WHEN an image filename like 'Notion_COMSATS_Lahore_meetup_Selfie.jpeg' is processed, THE Caption Generator SHALL format it as 'Notion COMSATS Lahore Meetup Selfie' (replace underscores with spaces, apply title case)
4. WHEN an image filename like 'Temp Jam 3.0 Pic.jpeg' is processed, THE Caption Generator SHALL format it as 'Temp Jam 3.0 Pic' (preserve version numbers and punctuation, apply title case as needed)
5. FOR each gallery image, THE Caption Generator SHALL create a caption object with fields: id (unique identifier), caption (formatted title), photos (array with image path)

### Requirement 5: File Organization and Storage Strategy

**User Story:** As a developer maintaining the portfolio, I want gallery images to be organized in a predictable file structure.

#### Acceptance Criteria

1. WHEN gallery images are populated, THE File Organizer SHALL move all categorized images to public/gallery/{category}/ subdirectories (personal, projects, achievements)
2. WHEN images are moved, THE File Organizer SHALL preserve original filenames
3. WHEN the Gallery IMAGES object is populated, THE File Organizer SHALL use absolute paths in the format /gallery/category/filename.ext
4. IF a public/gallery/ directory does not exist, THEN THE File Organizer SHALL create it along with subdirectories
5. IF an image file cannot be moved (permission denied, source not found), THEN THE File Organizer SHALL log a warning and skip that image (not fail the entire operation)

### Requirement 6: Prevent Duplicate and Conflicting Entries

**User Story:** As a developer, I want to ensure the portfolio does not contain duplicate projects or images.

#### Acceptance Criteria

1. WHEN projects are added from GitHub, THE Deduplication Handler SHALL verify that no project with the same repository URL already exists in the PROJECTS array
2. WHEN projects are added from GitHub, THE Deduplication Handler SHALL verify that no project with the same humanized title already exists (case-insensitive)
3. IF a duplicate is detected by title or URL, THEN THE Deduplication Handler SHALL log the duplicate and skip adding it
4. WHEN images are categorized, THE Deduplication Handler SHALL ensure no duplicate image file appears in the same category
5. IF the same image file is encountered twice, THEN THE Deduplication Handler SHALL use only the first occurrence and log a warning

### Requirement 7: Graceful Degradation and Error Handling

**User Story:** As a user, I want the portfolio to remain fully functional even if some GitHub projects cannot be fetched or some images are missing.

#### Acceptance Criteria

1. IF the GitHub API is unreachable or rate-limited, THEN THE Portfolio SHALL render successfully using only the existing PROJECTS array (without newly fetched projects)
2. IF an image file is deleted after categorization, THEN THE Gallery SHALL render without the missing image and log a warning
3. WHEN an error occurs during processing, THE System SHALL log clear error messages with context (filename, category attempt, reason for failure)
4. IF an image lacks proper extension or is corrupted, THEN THE System SHALL skip the image and continue processing remaining images
5. THE System SHALL never block portfolio deployment due to incomplete gallery data or failed GitHub fetches

### Requirement 8: Update and Maintenance Workflow

**User Story:** As Ahmad, I want to easily update the gallery when new images are added to the workspace.

#### Acceptance Criteria

1. WHEN a new image is added to the workspace root, THE System SHALL support a manual re-run command to regenerate gallery categories
2. WHEN the Projects page is viewed, THE System SHALL provide clear documentation on how to add new GitHub projects (pointing users to README or inline comments)
3. THE Generated Code SHALL include inline comments explaining the IMAGES object structure and how to manually add entries if automated fetching is unavailable
4. WHEN documentation is generated, THE System SHALL include examples showing how to add custom captions or override auto-generated ones

