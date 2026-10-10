#!/usr/bin/env node

/**
 * Portfolio Data Build Script - Complete Orchestration
 *
 * This script:
 * 1. Fetches public GitHub repositories from the user's GitHub profile
 * 2. Filters and transforms them into project card entries
 * 3. Scans workspace images, categorizes them, and generates captions
 * 4. Organizes images into public/gallery/ structure with metadata
 * 5. Updates Projects.jsx and Gallery.jsx with generated data
 *
 * Usage: npm run build:portfolio
 * Environment: GITHUB_TOKEN (optional, for higher API rate limits)
 *
 * @example
 * # Build with automatic rate limiting (60 requests/hour)
 * npm run build:portfolio
 *
 * @example
 * # Build with GitHub token (5000 requests/hour)
 * GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx npm run build:portfolio
 */

const fs = require('fs');
const path = require('path');

// ================================================================
// IMPORTS - Utility Modules
// ================================================================
const githubProcessor = require('../src/utils/githubProcessor');
const imageProcessor = require('../src/utils/imageProcessor');

/**
 * Logger utility with consistent formatting across all operations
 *
 * Provides structured logging with timestamps, module names, and context.
 * Used throughout the build process for visibility and debugging.
 *
 * @typedef {Object} Logger
 * @property {Function} error - Log error with context
 * @property {Function} warn - Log warning with context
 * @property {Function} info - Log info message
 * @property {Function} success - Log success message with checkmark
 * @property {Function} fail - Log failure message with X
 */
const logger = {
  error: (module, message, context = {}) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp} ${module}:`);
    console.error(`  Message: ${message}`);
    if (Object.keys(context).length > 0) {
      console.error(`  Context:`, context);
    }
  },
  warn: (module, message, context = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp} ${module}:`);
    console.warn(`  Message: ${message}`);
    if (Object.keys(context).length > 0) {
      console.warn(`  Context:`, context);
    }
  },
  info: (module, message) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp} ${module}: ${message}`);
  },
  success: (message) => {
    console.log(`✅ ${message}`);
  },
  fail: (message) => {
    console.error(`❌ ${message}`);
  }
};

// ================================================================
// PHASE 1: File Extraction & Parsing
// ================================================================

/**
 * Extracts the PROJECTS array from Projects.jsx
 *
 * Parses the Projects.jsx file and extracts the existing PROJECTS array
 * so that new projects can be appended without duplicating existing ones.
 *
 * @function extractProjectsFromFile
 * @param {string} filePath - Absolute path to Projects.jsx
 * @returns {Array<Object>} Array of project objects with: title, desc, tech, ss, live, code
 * @throws Logs error and returns empty array on parse failure
 *
 * @example
 * const projects = extractProjectsFromFile('/path/to/Projects.jsx');
 * // Returns: [{ title: "Tic Tac Toe (AI Edition)", desc: "...", ... }, ...]
 */
function extractProjectsFromFile(filePath) {
  try {
    logger.info('extractProjectsFromFile', `Parsing ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf-8');

    // Find the PROJECTS array definition
    const projectsMatch = content.match(/const\s+PROJECTS\s*=\s*(\[[\s\S]*?\])(?=\n\n|const\s|\n\nfunction)/);

    if (!projectsMatch) {
      logger.warn('extractProjectsFromFile', 'Could not find PROJECTS array, returning empty');
      return [];
    }

    const projectsCode = projectsMatch[1];

    // Safely evaluate the array
    // Using Function to create a temporary scope
    const extractedProjects = (function() {
      return eval('(' + projectsCode + ')');
    })();

    logger.info('extractProjectsFromFile', `Extracted ${extractedProjects.length} existing projects`);
    return extractedProjects;
  } catch (err) {
    logger.error('extractProjectsFromFile', err.message, { filePath, error: err.message });
    return [];
  }
}

/**
 * Extracts the IMAGES object from Gallery.jsx
 *
 * Parses the Gallery.jsx file and extracts the existing IMAGES object
 * so that new images can be merged without duplicating existing ones.
 *
 * @function extractGalleryFromFile
 * @param {string} filePath - Absolute path to Gallery.jsx
 * @returns {Object} IMAGES object with personal, projects, achievements arrays
 * @throws Logs error and returns empty structure on parse failure
 *
 * @example
 * const images = extractGalleryFromFile('/path/to/Gallery.jsx');
 * // Returns: { personal: [...], projects: [...], achievements: [...] }
 */
function extractGalleryFromFile(filePath) {
  try {
    logger.info('extractGalleryFromFile', `Parsing ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf-8');

    // Find the IMAGES object definition
    const imagesMatch = content.match(/const\s+IMAGES\s*=\s*(\{[\s\S]*?\});/);

    if (!imagesMatch) {
      logger.warn('extractGalleryFromFile', 'Could not find IMAGES object, returning empty structure');
      return { personal: [], projects: [], achievements: [] };
    }

    const imagesCode = imagesMatch[1];

    // Safely evaluate the object
    const extractedImages = (function() {
      return eval('(' + imagesCode + ')');
    })();

    logger.info('extractGalleryFromFile', `Extracted images: personal=${extractedImages.personal?.length || 0}, projects=${extractedImages.projects?.length || 0}, achievements=${extractedImages.achievements?.length || 0}`);
    return extractedImages;
  } catch (err) {
    logger.error('extractGalleryFromFile', err.message, { filePath });
    return { personal: [], projects: [], achievements: [] };
  }
}

// ================================================================
// PHASE 2: File Updates
// ================================================================

/**
 * Updates the PROJECTS array in Projects.jsx
 *
 * Replaces the existing PROJECTS array with the new one while preserving
 * file formatting, comments, and component structure.
 *
 * @function updateProjectsFile
 * @param {string} filePath - Absolute path to Projects.jsx
 * @param {Array<Object>} projects - New projects array to write
 * @throws Logs error on write failure
 *
 * @example
 * updateProjectsFile('/path/to/Projects.jsx', updatedProjects);
 * // Projects.jsx is now updated with new projects
 */
function updateProjectsFile(filePath, projects) {
  try {
    logger.info('updateProjectsFile', `Writing ${projects.length} projects to ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf-8');

    // Format projects array with proper indentation
    const projectsCode = projects.map((p, idx) => {
      const techStr = p.tech.map(t => `'${t}'`).join(', ');
      return `{
  title: '${p.title.replace(/'/g, "\\'")}',
  desc: '${p.desc.replace(/'/g, "\\'")}',
  ss: '${p.ss}',
  tech: [${techStr}],
  live: '${p.live}',
  code: '${p.code}'
}`;
    }).join(',\n');

    // Replace the PROJECTS array
    const newContent = content.replace(
      /const\s+PROJECTS\s*=\s*\[[\s\S]*?\]/,
      `const PROJECTS = [\n${projectsCode}\n]`
    );

    fs.writeFileSync(filePath, newContent, 'utf-8');
    logger.success(`Updated Projects.jsx with ${projects.length} projects`);
  } catch (err) {
    logger.error('updateProjectsFile', err.message, { filePath });
  }
}

/**
 * Updates the IMAGES object in Gallery.jsx
 *
 * Replaces the existing IMAGES object with the new one while preserving
 * file formatting, comments, and component structure.
 *
 * @function updateGalleryFile
 * @param {string} filePath - Absolute path to Gallery.jsx
 * @param {Object} images - New IMAGES object with personal, projects, achievements
 * @throws Logs error on write failure
 *
 * @example
 * updateGalleryFile('/path/to/Gallery.jsx', updatedImages);
 * // Gallery.jsx is now updated with new images
 */
function updateGalleryFile(filePath, images) {
  try {
    logger.info('updateGalleryFile', `Writing gallery images to ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf-8');

    // Format images object with proper structure
    const formatImages = (imgs) => {
      return imgs.map(img => {
        const photosStr = img.photos.map(p => `"${p}"`).join(', ');
        return `{ id: '${img.id}', caption: '${img.caption.replace(/'/g, "\\'")}', photos: [${photosStr}] }`;
      }).join(',\n    ');
    };

    const personalStr = formatImages(images.personal);
    const projectsStr = formatImages(images.projects);
    const achievementsStr = formatImages(images.achievements);

    const imagesCode = `{
  personal: [${personalStr ? '\n    ' + personalStr + '\n  ' : ''}],
  projects: [${projectsStr ? '\n    ' + projectsStr + '\n  ' : ''}],
  achievements: [${achievementsStr ? '\n    ' + achievementsStr + '\n  ' : ''}],
}`;

    // Replace the IMAGES object
    const newContent = content.replace(
      /const\s+IMAGES\s*=\s*\{[\s\S]*?\};/,
      `const IMAGES = ${imagesCode};`
    );

    fs.writeFileSync(filePath, newContent, 'utf-8');
    logger.success(`Updated Gallery.jsx with ${images.personal.length + images.projects.length + images.achievements.length} images`);
  } catch (err) {
    logger.error('updateGalleryFile', err.message, { filePath });
  }
}

// ================================================================
// PHASE 3: Main Build Orchestration
// ================================================================

/**
 * Main build function - orchestrates all portfolio data generation
 *
 * Coordinates the following workflow:
 * 1. Extract existing projects from Projects.jsx
 * 2. Fetch new projects from GitHub API
 * 3. Merge and update Projects.jsx
 * 4. Extract existing images from Gallery.jsx
 * 5. Scan and organize workspace images
 * 6. Merge and update Gallery.jsx
 *
 * Handles all errors gracefully with fallbacks to preserve existing data.
 *
 * @async
 * @function buildPortfolioData
 * @returns {Promise<void>}
 * @throws Logs all errors but exits with code 0 for graceful degradation
 *
 * @example
 * // Run with environment variable
 * GITHUB_TOKEN=ghp_xxx node scripts/build-portfolio-data.js
 */
async function buildPortfolioData() {
  try {
    logger.info('buildPortfolioData', 'Starting portfolio data build...');

    const workspaceRoot = path.join(__dirname, '..');
    const githubToken = process.env.GITHUB_TOKEN || null;
    const githubUsername = 'ahmadjawad533';

    logger.info('buildPortfolioData', `Workspace root: ${workspaceRoot}`);
    logger.info('buildPortfolioData', `GitHub API token: ${githubToken ? 'provided' : 'not provided (using 60 req/hour limit)'}`);

    // ================================================================
    // STEP 1: Build Projects array from GitHub
    // ================================================================
    logger.info('buildPortfolioData', 'Step 1: Fetching and processing GitHub projects...');

    try {
      const ProjectsPath = path.join(workspaceRoot, 'src/pages/Projects.jsx');
      const currentProjects = extractProjectsFromFile(ProjectsPath);
      const updatedProjects = await githubProcessor.buildUpdatedProjects(
        currentProjects,
        githubUsername,
        githubToken
      );
      updateProjectsFile(ProjectsPath, updatedProjects);
      logger.success(`GitHub projects processed. Total projects: ${updatedProjects.length}`);
    } catch (err) {
      logger.warn('buildPortfolioData', 'GitHub processing failed, skipping', { error: err.message });
      logger.info('buildPortfolioData', 'Existing projects preserved');
    }

    // ================================================================
    // STEP 2: Build Gallery IMAGES from workspace images
    // ================================================================
    logger.info('buildPortfolioData', 'Step 2: Scanning and organizing gallery images...');

    try {
      const GalleryPath = path.join(workspaceRoot, 'src/pages/Gallery.jsx');
      const currentImages = extractGalleryFromFile(GalleryPath);
      const galleryRoot = path.join(workspaceRoot, 'public/gallery');

      // Create gallery directories if they don't exist
      const categories = ['personal', 'projects', 'achievements'];
      for (const category of categories) {
        const categoryPath = path.join(galleryRoot, category);
        if (!fs.existsSync(categoryPath)) {
          fs.mkdirSync(categoryPath, { recursive: true });
          logger.info('buildPortfolioData', `Created gallery directory: ${categoryPath}`);
        }
      }

      // Scan and organize images
      const imageFiles = await imageProcessor.scanImageFiles(workspaceRoot);
      const organizedImages = await imageProcessor.organizeGalleryImages(
        imageFiles,
        workspaceRoot,
        galleryRoot
      );

      // Helper to merge existing and newly organized images without duplicates
      const mergeCategory = (currentList = [], newList = []) => {
        const merged = [...currentList];
        const existingIds = new Set(currentList.map(item => item.id));
        for (const item of (newList || [])) {
          if (!existingIds.has(item.id)) {
            merged.push(item);
            existingIds.add(item.id);
          }
        }
        return merged;
      };

      // Build gallery object with all categories merged
      const updatedImages = {
        personal: mergeCategory(currentImages.personal, organizedImages.personal),
        projects: mergeCategory(currentImages.projects, organizedImages.projects),
        achievements: mergeCategory(currentImages.achievements, organizedImages.achievements)
      };

      updateGalleryFile(GalleryPath, updatedImages);
      const totalImages = updatedImages.personal.length + updatedImages.projects.length + updatedImages.achievements.length;
      logger.success(`Gallery images processed. Total images: ${totalImages}`);
    } catch (err) {
      logger.warn('buildPortfolioData', 'Image processing failed, skipping', { error: err.message });
      logger.info('buildPortfolioData', 'Existing gallery images preserved');
    }

    // ================================================================
    // Success
    // ================================================================
    logger.success('Portfolio data build completed successfully');
    logger.info('buildPortfolioData', 'Build process finished. Projects and gallery are updated.');
    process.exit(0);

  } catch (err) {
    logger.fail('Build failed with unexpected error');
    logger.error('buildPortfolioData', err.message, { stack: err.stack });
    process.exit(1);
  }
}

// ================================================================
// Entry Point
// ================================================================
if (require.main === module) {
  buildPortfolioData().catch((err) => {
    logger.fail('Uncaught error in buildPortfolioData');
    logger.error('buildPortfolioData', err.message, { stack: err.stack });
    process.exit(1);
  });
}

module.exports = {
  buildPortfolioData,
  logger,
  extractProjectsFromFile,
  extractGalleryFromFile,
  updateProjectsFile,
  updateGalleryFile
};
