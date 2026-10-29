/**
 * @fileoverview imageProcessor.js - Scan, categorize, and organize gallery images
 *
 * This utility module provides functions to scan workspace images, categorize them
 * by keywords (personal, projects, achievements), generate captions from filenames,
 * and organize them into a structured directory layout with metadata.
 *
 * The module handles:
 * 1. Scanning workspace for image files (jpg, jpeg, png, gif, webp)
 * 2. Categorizing images by keyword matching with priority ordering
 * 3. Generating human-readable captions from filenames
 * 4. Moving images to public/gallery/{category}/ directories
 * 5. Building a Gallery IMAGES object for Gallery.jsx
 *
 * All operations include comprehensive error handling and graceful degradation
 * to ensure the portfolio remains functional even if some images fail to process.
 *
 * @module imageProcessor
 * @requires fs (Node.js file system)
 * @requires path (Node.js path utilities)
 *
 * @example
 * const { scanImageFiles, categorizeImage, generateCaption, organizeGalleryImages } = require('./imageProcessor');
 *
 * // Scan for images
 * const images = scanImageFiles('./');
 *
 * // Categorize and organize
 * const galleryObject = await organizeGalleryImages(images, './', './public/gallery');
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Image file extensions to scan for (case-insensitive)
 * @type {string[]}
 */
const SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * Keywords for categorizing images by type
 * Organized by priority (achievements > projects > personal)
 * @type {Object}
 */
const CATEGORY_KEYWORDS = {
  achievements: [
    'achievement', 'award', 'top', 'captain', 'selection', 'finalist',
    'finale', 'cloud', 'quest', 'level', 'kiro', 'grand',
  ],
  projects: [
    'project', 'temp jam', 'jam',
  ],
  personal: [
    'personal', 'photo', 'selfie', 'moment', 'me', 'meetup', 'recap',
    'notification', 'announcement', 'leader', 'advisor', 'campus', 'notion',
  ],
};

/**
 * Category priority order (higher number = higher priority)
 * Used for disambiguation when image matches multiple categories
 * @type {Object}
 */
const CATEGORY_PRIORITY = {
  achievements: 3,
  projects: 2,
  personal: 1,
};

/**
 * Default category for images that don't match any keywords
 * @type {string}
 */
const DEFAULT_CATEGORY = 'personal';

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Scans a directory for image files (non-recursive)
 *
 * Searches the specified directory for files with image extensions.
 * Returns objects with both filename and full path for later processing.
 *
 * @async
 * @function scanImageFiles
 * @param {string} sourceDir - Directory to scan for images (default: current directory)
 * @returns {Promise<Array<Object>>} Array of image objects with:
 *          { filename: string, fullPath: string, size: number }
 *
 * @throws {Error} If directory is not accessible (logged, operation continues)
 *
 * @example
 * const images = await scanImageFiles('./workspace');
 * // Returns: [
 * //   { filename: 'Photo.jpg', fullPath: '/path/to/Photo.jpg', size: 102400 }
 * // ]
 *
 * Requirements: 7.4 (handle missing files gracefully)
 */
async function scanImageFiles(sourceDir = '.') {
  const images = [];

  try {
    console.log(`[imageProcessor] Scanning for images in: ${sourceDir}`);

    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      // Skip directories
      if (entry.isDirectory()) {
        continue;
      }

      // Check if file has supported image extension
      const ext = path.extname(entry.name).toLowerCase();
      if (!SUPPORTED_IMAGE_EXTENSIONS.includes(ext)) {
        continue;
      }

      const fullPath = path.join(sourceDir, entry.name);

      try {
        // Get file stats for size information
        const stats = await fs.stat(fullPath);
        images.push({
          filename: entry.name,
          fullPath: fullPath,
          size: stats.size,
        });
        console.log(`[imageProcessor] Found image: ${entry.name} (${stats.size} bytes)`);
      } catch (error) {
        console.warn(
          `[imageProcessor] Could not access file "${entry.name}": ${error.message}`
        );
        // Continue processing other files
      }
    }

    console.log(`[imageProcessor] Scan complete. Found ${images.length} images`);
    return images;
  } catch (error) {
    console.error(
      `[imageProcessor] Error scanning directory "${sourceDir}": ${error.message}`
    );
    return [];
  }
}

/**
 * Categorizes an image by matching filename against keywords
 *
 * Normalizes filename to lowercase for keyword matching. Handles multi-matches
 * by using priority ordering (achievements > projects > personal). If no keywords
 * match, defaults to 'personal' category.
 *
 * @function categorizeImage
 * @param {string} filename - Image filename (with extension)
 * @returns {string} Category name: 'achievements', 'projects', or 'personal'
 *
 * @example
 * categorizeImage('AWS_Cloud_Club_Captain_Selection.png');
 * // Returns: 'achievements'
 *
 * categorizeImage('Temp_Jam_3.0_Pic.jpeg');
 * // Returns: 'projects'
 *
 * categorizeImage('Notion_Meetup_Selfie.jpg');
 * // Returns: 'personal'
 *
 * categorizeImage('random_photo.png');
 * // Returns: 'personal' (default)
 *
 * Requirements: 3.2, 3.3, 3.4, 3.5, 3.6
 */
function categorizeImage(filename) {
  if (!filename || typeof filename !== 'string') {
    return DEFAULT_CATEGORY;
  }

  // Normalize filename to lowercase for keyword matching
  const normalized = filename.toLowerCase();

  // Track which categories match
  let matchedCategory = null;
  let highestPriority = 0;

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        const priority = CATEGORY_PRIORITY[category] || 0;
        
        // Update if this is a higher priority match
        if (priority > highestPriority) {
          matchedCategory = category;
          highestPriority = priority;
        }
      }
    }
  }

  // Return matched category or default
  const result = matchedCategory || DEFAULT_CATEGORY;
  
  if (matchedCategory) {
    console.log(
      `[imageProcessor] Categorized "${filename}" → "${result}"`
    );
  }

  return result;
}

/**
 * Generates a caption and metadata object from an image filename
 *
 * Removes file extension, replaces underscores/hyphens with spaces,
 * applies title case, and generates a unique ID for the caption.
 *
 * @function generateCaption
 * @param {string} filename - Image filename with extension
 * @param {string} imagePath - Full path to the image file in gallery
 * @returns {Object} Caption object with structure:
 *          {
 *            id: string (unique identifier),
 *            caption: string (formatted title),
 *            photos: string[] (array with imagePath)
 *          }
 *
 * @example
 * generateCaption('AWS_Cloud_Club_Captain_Selection.png', '/gallery/achievements/AWS_Cloud_Club_Captain_Selection.png');
 * // Returns: {
 * //   id: 'aws_cloud_club_captain_selection',
 * //   caption: 'AWS Cloud Club Captain Selection',
 * //   photos: ['/gallery/achievements/AWS_Cloud_Club_Captain_Selection.png']
 * // }
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */
function generateCaption(filename, imagePath = '') {
  if (!filename || typeof filename !== 'string') {
    throw new Error('[imageProcessor] Invalid filename for caption generation');
  }

  // Remove file extension
  const nameWithoutExt = path.parse(filename).name;

  // Replace underscores and hyphens with spaces
  let captionText = nameWithoutExt.replace(/[_-]/g, ' ');

  // Apply title case transformation
  captionText = captionText
    .split(/\s+/)
    .map((word) => {
      if (word.length === 0) return '';
      // Preserve all-caps acronyms (length > 1 and all uppercase)
      const isAcronym = word.length > 1 && /^[A-Z]+$/.test(word);
      if (isAcronym) {
        return word;
      }
      // Title case: first letter uppercase, rest lowercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();

  // Generate unique ID (hash of filename or just slugified)
  const slug = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const captionObject = {
    id: slug,
    caption: captionText,
    photos: imagePath ? [imagePath] : [],
  };

  console.log(
    `[imageProcessor] Generated caption: "${captionText}" (id: ${slug})`
  );

  return captionObject;
}

/**
 * Moves all images to public/gallery/{category}/ and builds gallery object
 *
 * For each image:
 * 1. Determine category via categorizeImage()
 * 2. Move file to public/gallery/{category}/filename
 * 3. Generate caption with new path
 * 4. Check for duplicates within category
 *
 * Builds IMAGES object grouped by category with all captions.
 *
 * @async
 * @function organizeGalleryImages
 * @param {Array<Object>} imageFiles - Array of image objects from scanImageFiles()
 * @param {string} sourceDir - Source directory containing original images
 * @param {string} galleryDir - Target gallery directory (usually ./public/gallery)
 *
 * @returns {Promise<Object>} IMAGES object for Gallery.jsx:
 *          {
 *            personal: [ { id, caption, photos }, ... ],
 *            projects: [ { id, caption, photos }, ... ],
 *            achievements: [ { id, caption, photos }, ... ]
 *          }
 *
 * @throws {Error} On critical file operation failures (logged, operation continues)
 *
 * @example
 * const images = await scanImageFiles('./');
 * const gallery = await organizeGalleryImages(images, './', './public/gallery');
 *
 * Requirements: 5.1, 5.2, 5.3, 6.4, 7.2, 7.5
 */
async function organizeGalleryImages(imageFiles, sourceDir = '.', galleryDir = './public/gallery') {
  if (!Array.isArray(imageFiles)) {
    console.error('[imageProcessor] imageFiles must be an array');
    return { personal: [], projects: [], achievements: [] };
  }

  console.log(
    `[imageProcessor] Organizing ${imageFiles.length} images into gallery...`
  );

  const galleryObject = {
    personal: [],
    projects: [],
    achievements: [],
  };

  const processedFiles = new Set(); // Track processed files to detect duplicates

  // Ensure gallery directory exists
  try {
    await fs.mkdir(galleryDir, { recursive: true });
    console.log(`[imageProcessor] Ensured gallery directory exists: ${galleryDir}`);

    // Create category subdirectories
    for (const category of Object.keys(galleryObject)) {
      const categoryDir = path.join(galleryDir, category);
      await fs.mkdir(categoryDir, { recursive: true });
      console.log(`[imageProcessor] Ensured category directory exists: ${categoryDir}`);
    }
  } catch (error) {
    console.error(
      `[imageProcessor] Error creating gallery directories: ${error.message}`
    );
    return galleryObject;
  }

  // Process each image
  for (const imageFile of imageFiles) {
    try {
      const { filename, fullPath } = imageFile;

      // Determine category
      const category = categorizeImage(filename);

      // Check for duplicates within category
      const categoryKey = `${category}:${filename.toLowerCase()}`;
      if (processedFiles.has(categoryKey)) {
        console.warn(
          `[imageProcessor] Skipping duplicate image in "${category}" category: ${filename}`
        );
        continue;
      }

      // Build target path
      const targetDir = path.join(galleryDir, category);
      const targetPath = path.join(targetDir, filename);
      const galleryPath = `/gallery/${category}/${filename}`;

      // Move file (or copy if move not supported)
      try {
        // Check if source and target are the same
        if (path.resolve(fullPath) !== path.resolve(targetPath)) {
          await fs.copyFile(fullPath, targetPath);
          console.log(
            `[imageProcessor] Moved image: ${filename} → ${category}/`
          );
        } else {
          console.log(
            `[imageProcessor] Image already in correct location: ${filename}`
          );
        }
      } catch (moveError) {
        console.warn(
          `[imageProcessor] Could not move file "${filename}": ${moveError.message}`
        );
        // Continue processing other images
        continue;
      }

      // Generate caption
      const caption = generateCaption(filename, galleryPath);

      // Add to gallery object
      galleryObject[category].push(caption);
      processedFiles.add(categoryKey);

      console.log(
        `[imageProcessor] Added to gallery: ${category}/${filename}`
      );
    } catch (error) {
      console.warn(
        `[imageProcessor] Failed to process image "${imageFile.filename}": ${error.message}`
      );
      // Continue processing other images
    }
  }

  console.log(
    `[imageProcessor] Gallery organization complete. Summary:`,
    {
      personal: galleryObject.personal.length,
      projects: galleryObject.projects.length,
      achievements: galleryObject.achievements.length,
    }
  );

  return galleryObject;
}

/**
 * Builds the final IMAGES object for Gallery.jsx
 *
 * Takes array of organized image captions and groups them by category.
 * Ensures all three categories are present (even if empty).
 *
 * @function buildGalleryObject
 * @param {Array<Object>} imageFiles - Array of image objects from scanImageFiles()
 * @param {string} sourceDir - Source directory
 * @param {string} galleryDir - Target gallery directory
 *
 * @returns {Object} IMAGES object ready for Gallery.jsx
 *
 * Requirements: 5.1, 6.4
 */
function buildGalleryObject(captions, category) {
  return {
    [category]: Array.isArray(captions) ? captions : [],
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  scanImageFiles,
  categorizeImage,
  generateCaption,
  organizeGalleryImages,
  buildGalleryObject,
  SUPPORTED_IMAGE_EXTENSIONS,
  CATEGORY_KEYWORDS,
  CATEGORY_PRIORITY,
  DEFAULT_CATEGORY,
};
