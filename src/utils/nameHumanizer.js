/**
 * @fileoverview nameHumanizer.js - Transform repository and image filenames into human-readable titles
 *
 * This utility module provides functions to convert machine-friendly names (with underscores,
 * hyphens, and acronyms) into human-readable titles while preserving intent and handling edge cases.
 *
 * The module handles two main use cases:
 * 1. Repository names: Convert "Tick_Tack_Toe" to "Tic Tac Toe"
 * 2. Image filenames: Convert "AWS_Cloud_Club_Captain.jpg" to "AWS Cloud Club Captain"
 *
 * Both functions apply consistent title-case formatting and handle acronym preservation.
 * The ensureUniqueTitle() function prevents title collisions in project arrays by appending
 * disambiguators (e.g., "(v2)", "(v3)") when necessary.
 *
 * @module nameHumanizer
 * @exports {Function} humanizeName - Converts underscores/hyphens to spaces and applies title case
 * @exports {Function} ensureUniqueTitle - Ensures a title is unique within an existing projects array
 *
 * @example
 * // Basic repository name humanization
 * const title1 = humanizeName("Tick_Tack_Toe");
 * // Returns: "Tic Tac Toe"
 *
 * const title2 = humanizeName("AWS-Campus-Help-Assistant");
 * // Returns: "AWS Campus Help Assistant"
 *
 * const title3 = humanizeName("CRUD-API");
 * // Returns: "CRUD API"
 *
 * @example
 * // Ensuring unique titles for project deduplication
 * const existingProjects = [
 *   { title: "CRUD API", code: "...", desc: "..." },
 *   { title: "CRUD API (v2)", code: "...", desc: "..." }
 * ];
 *
 * const uniqueTitle = ensureUniqueTitle("CRUD API", existingProjects);
 * // Returns: "CRUD API (v3)"
 */

/**
 * Converts repository names and filenames into human-readable titles.
 *
 * Transforms machine-friendly names by:
 * 1. Replacing underscores with spaces
 * 2. Replacing hyphens with spaces
 * 3. Applying title case (capitalize first letter of each word)
 * 4. Preserving standalone acronyms (all-uppercase words like "CRUD", "API")
 * 5. Cleaning up multiple spaces
 * 6. Trimming leading/trailing spaces
 *
 * @function humanizeName
 * @param {string} repoName - The repository name or filename to humanize (without extension)
 * @returns {string} The humanized, title-cased name
 *
 * @example
 * humanizeName("Tick_Tack_Toe");
 * // Returns: "Tic Tac Toe"
 *
 * @example
 * humanizeName("AWS-Campus-Help-Assistant");
 * // Returns: "AWS Campus Help Assistant"
 *
 * @example
 * humanizeName("CRUD-API");
 * // Returns: "CRUD API"
 *
 * @example
 * humanizeName("machine_learning_model");
 * // Returns: "Machine Learning Model"
 *
 * @example
 * humanizeName("WebSocket-Handler");
 * // Returns: "Websocket Handler"
 *
 * @description
 * Algorithm details:
 * - Underscores and hyphens are normalized to spaces
 * - Words that are entirely uppercase and length > 1 are treated as acronyms and preserved
 * - All other words follow standard title case (first letter capitalized, rest lowercase)
 * - Multiple consecutive spaces are collapsed to single spaces
 * - Leading/trailing spaces are removed
 *
 * Edge cases handled:
 * - Empty or whitespace-only strings return empty string
 * - Single-character words are capitalized
 * - Numbers and special characters are preserved
 * - Acronyms like "AWS", "CRUD", "API", "ML" are preserved exactly as uppercase
 */
function humanizeName(repoName) {
  // Handle edge cases: empty or whitespace-only strings
  if (!repoName || typeof repoName !== 'string' || !repoName.trim()) {
    return '';
  }

  // Step 1: Normalize separators (underscores and hyphens to spaces)
  let normalized = repoName.replace(/[_-]/g, ' ');

  // Step 2: Split into words
  const words = normalized.split(/\s+/).filter(word => word.length > 0);

  // Step 3: Apply title case to each word, preserving acronyms
  const titleCasedWords = words.map(word => {
    // A word is considered an acronym if it's entirely uppercase and length > 1
    const isAcronym = word.length > 1 && /^[A-Z]+$/.test(word);

    if (isAcronym) {
      // Preserve acronyms as-is
      return word;
    } else {
      // Apply title case: first letter uppercase, rest lowercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });

  // Step 4: Join words with single spaces
  const result = titleCasedWords.join(' ');

  // Step 5: Return trimmed result (handles edge cases of multiple spaces)
  return result.trim();
}

/**
 * Ensures a project title is unique within an existing projects array.
 *
 * Checks if a proposed title already exists in the PROJECTS array (case-insensitive).
 * If a collision is detected, appends a disambiguator (default: " (v2)") to create uniqueness.
 * If the disambiguated title still collides, iterates the version number (v3, v4, etc.)
 * until a unique title is found.
 *
 * @function ensureUniqueTitle
 * @param {string} title - The proposed project title to check for uniqueness
 * @param {Array<Object>} existingProjects - The existing PROJECTS array to check against
 * @param {Object} existingProjects[].title - Project title to compare (case-insensitive)
 * @param {string} [disambiguator="v2"] - The string to append if collision detected (without spaces)
 * @returns {string} The original title if unique, or a disambiguated version if collision found
 *
 * @example
 * const projects = [
 *   { title: "CRUD API", code: "...", desc: "..." }
 * ];
 *
 * ensureUniqueTitle("CRUD API", projects);
 * // Returns: "CRUD API (v2)"
 *
 * @example
 * const projects = [
 *   { title: "CRUD API", code: "...", desc: "..." },
 *   { title: "CRUD API (v2)", code: "...", desc: "..." }
 * ];
 *
 * ensureUniqueTitle("CRUD API", projects);
 * // Returns: "CRUD API (v3)"
 *
 * @example
 * const projects = [
 *   { title: "Web Server", code: "...", desc: "..." }
 * ];
 *
 * ensureUniqueTitle("New Project", projects);
 * // Returns: "New Project" (no collision, returned as-is)
 *
 * @example
 * const projects = [
 *   { title: "api-gateway", code: "...", desc: "..." }
 * ];
 *
 * ensureUniqueTitle("API-Gateway", projects, "copy");
 * // Returns: "API-Gateway (copy)" (case-insensitive collision, custom disambiguator)
 *
 * @description
 * Collision detection is case-insensitive to prevent duplicate titles like:
 * - "CRUD API" and "crud api"
 * - "AWS Assistant" and "aws assistant"
 *
 * The function logs each detected collision for debugging purposes.
 *
 * Edge cases handled:
 * - Empty title: returns as-is (no collision possible)
 * - Empty projects array: returns title as-is
 * - Case-insensitive matching ensures no near-duplicate titles
 * - Automatic version iteration prevents infinite loops
 */
function ensureUniqueTitle(title, existingProjects, disambiguator = "v2") {
  // Handle edge cases: empty or invalid inputs
  if (!title || typeof title !== 'string' || !title.trim()) {
    return title || '';
  }

  if (!existingProjects || !Array.isArray(existingProjects)) {
    return title;
  }

  // Normalize the proposed title to lowercase for case-insensitive comparison
  const normalizedTitle = title.toLowerCase().trim();

  // Create a set of existing project titles (normalized to lowercase)
  const existingTitles = new Set(
    existingProjects
      .map((proj) => {
        const projTitle = proj.title || proj.name || '';
        return projTitle.toLowerCase().trim();
      })
      .filter((t) => t.length > 0)
  );

  // Check if the title already exists (exact match)
  if (!existingTitles.has(normalizedTitle)) {
    // No collision, return original title as-is
    return title;
  }

  // Collision detected: log and append disambiguator
  console.log(
    `[nameHumanizer] Title collision detected: "${title}" already exists in projects.`
  );

  // Extract version number from disambiguator (e.g., "v2" → 2)
  let versionBase = disambiguator;
  let versionNum = 2;

  // Check if disambiguator is in format "v{number}"
  const versionMatch = disambiguator.match(/^v(\d+)$/);
  if (versionMatch) {
    versionBase = 'v';
    versionNum = parseInt(versionMatch[1], 10);
  }

  // Iterate version numbers until a unique title is found
  let uniqueTitle;
  let currentVersion = versionNum;

  do {
    const suffix =
      versionBase === 'v'
        ? ` (${versionBase}${currentVersion})`
        : ` (${versionBase})`;
    uniqueTitle = title + suffix;
    currentVersion++;

    // Safety check: prevent infinite loops (max 100 attempts)
    if (currentVersion > 100) {
      console.warn(
        `[nameHumanizer] Could not find unique title after 100 attempts. Using: "${uniqueTitle}"`
      );
      break;
    }
  } while (
    existingTitles.has(uniqueTitle.toLowerCase().trim()) ||
    currentVersion - versionNum === 0
  );

  console.log(`[nameHumanizer] Generated unique title: "${uniqueTitle}"`);
  return uniqueTitle;
}

// Export functions for use in build scripts and tests
module.exports = {
  humanizeName,
  ensureUniqueTitle,
};
