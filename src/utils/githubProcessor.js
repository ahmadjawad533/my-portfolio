/**
 * GitHub Repository Processor Utility
 *
 * This module provides utilities for fetching, filtering, and transforming GitHub repositories
 * into portfolio project entries. It handles GitHub API integration, data transformation,
 * deduplication, and merging with existing project data.
 *
 * Features:
 * - Fetches repositories from GitHub API with authentication
 * - Filters repositories based on exclusion rules and existing projects
 * - Transforms GitHub repo data into standardized portfolio format
 * - Merges new repositories with existing project data
 * - Comprehensive error handling and logging
 *
 * @module githubProcessor
 * @requires axios (for HTTP requests to GitHub API)
 */

// Import dependencies
const { humanizeName, ensureUniqueTitle } = require('./nameHumanizer.js');

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * GitHub API base URL for REST API v3
 * @type {string}
 */
const GITHUB_API_BASE_URL = 'https://api.github.com';

/**
 * GitHub API endpoint for user repositories
 * @type {string}
 */
const GITHUB_REPOS_ENDPOINT = '/user/repos';

/**
 * Default GitHub API request headers
 * Includes authentication and API version specification
 * @type {Object}
 */
const GITHUB_REQUEST_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'Portfolio-Gallery-Processor',
  // Authorization: 'token {TOKEN}' will be added dynamically
};

/**
 * Repository names to exclude from portfolio projects
 * These are typically portfolio/personal setup repos that shouldn't appear as projects
 * @type {string[]}
 */
const EXCLUDED_REPO_NAMES = [
  'my-portfolio-main',
  'portfolio',
  '.github',
  'dotfiles',
];

/**
 * GitHub API pagination configuration
 * @type {number}
 */
const GITHUB_API_PER_PAGE = 100;

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Fetches all public and private repositories for the authenticated GitHub user
 *
 * This function makes authenticated requests to the GitHub API to retrieve
 * all repositories owned by the specified user. It handles pagination to ensure
 * all repositories are fetched, not just the first page.
 *
 * API Details:
 * - Endpoint: GET /user/repos (requires authentication)
 * - Authentication: Bearer token or Basic auth (using token provided)
 * - Pagination: Uses per_page and page parameters for fetching all repos
 *
 * @async
 * @function fetchGitHubRepos
 * @param {string} username - GitHub username (used for logging/identification)
 * @param {string} token - GitHub Personal Access Token (PAT) for authentication
 *                         Must have 'public_repo' and 'repo' scopes
 *
 * @returns {Promise<Array<Object>>} Array of repository objects from GitHub API
 *          Each repo object contains: name, description, url, language, stargazers_count,
 *          updated_at, topics, visibility, etc.
 *
 * @throws {Error} If authentication fails (invalid token, rate limited, etc.)
 * @throws {Error} If GitHub API is unreachable or returns error status
 * @throws {Error} If token is missing or invalid format
 *
 * @example
 * try {
 *   const repos = await fetchGitHubRepos('octocat', 'ghp_xxxxxxxxxxxx');
 *   console.log(`Fetched ${repos.length} repositories`);
 * } catch (error) {
 *   console.error('Failed to fetch repositories:', error.message);
 * }
 *
 * Error Handling Strategy:
 * - Validate token format before API call
 * - Catch network errors and API errors separately
 * - Provide meaningful error messages for common issues:
 *   - 401: Invalid token
 *   - 403: Rate limit exceeded
 *   - 404: User not found
 * - Log detailed error information for debugging
 */
async function fetchGitHubRepos(username, token) {
  // Validate inputs
  if (!token || typeof token !== 'string' || !token.trim()) {
    throw new Error('[githubProcessor] GitHub token is required (GITHUB_TOKEN environment variable)');
  }

  if (!username || typeof username !== 'string' || !username.trim()) {
    throw new Error('[githubProcessor] GitHub username is required');
  }

  console.log(`[githubProcessor] Fetching repositories for user: ${username}`);

  const allRepos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const url = new URL(`${GITHUB_API_BASE_URL}/user/repos`);
      url.searchParams.append('per_page', String(GITHUB_API_PER_PAGE));
      url.searchParams.append('page', String(page));
      url.searchParams.append('type', 'owner'); // Only repos owned by user, not forks/collaborations

      const headers = {
        ...GITHUB_REQUEST_HEADERS,
        'Authorization': `token ${token}`,
      };

      console.log(`[githubProcessor] Fetching page ${page}...`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      });

      // Handle rate limiting
      if (response.status === 403) {
        const rateLimitReset = response.headers.get('x-ratelimit-reset');
        const retryAfter = response.headers.get('retry-after');
        console.error(
          `[githubProcessor] Rate limit exceeded. Reset at: ${new Date(parseInt(rateLimitReset) * 1000).toISOString()}`
        );
        throw new Error('GitHub API rate limit exceeded');
      }

      // Handle authentication errors
      if (response.status === 401) {
        throw new Error('Invalid GitHub token (401 Unauthorized). Check GITHUB_TOKEN environment variable');
      }

      // Handle not found
      if (response.status === 404) {
        throw new Error(`GitHub user not found: ${username}`);
      }

      // Handle other errors
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const repos = await response.json();

      // If we got fewer repos than the page size, this is the last page
      if (repos.length < GITHUB_API_PER_PAGE) {
        hasMore = false;
      }

      allRepos.push(...repos);
      page++;

      console.log(
        `[githubProcessor] Page ${page - 1} completed. Total repos so far: ${allRepos.length}`
      );
    } catch (error) {
      console.error(
        `[githubProcessor] Error fetching repositories (page ${page}): ${error.message}`
      );
      throw error;
    }
  }

  console.log(
    `[githubProcessor] Successfully fetched ${allRepos.length} repositories for ${username}`
  );
  return allRepos;
}

/**
 * Filters repositories based on exclusion rules and existing project data
 *
 * This function applies multiple filtering criteria to determine which repositories
 * should be added to the portfolio. It prevents duplicates, excludes specified repos,
 * and respects existing project data.
 *
 * Filtering Criteria (in order):
 * 1. Exclude repositories in EXCLUDED_REPO_NAMES list
 * 2. Exclude repositories already present in existingProjects (by name match)
 * 3. Exclude repositories in the excludedRepoNames parameter
 * 4. Keep repositories with valid names (non-empty, no special patterns)
 *
 * @function filterRepositories
 * @param {Array<Object>} repos - Array of repository objects from GitHub API
 * @param {Array<Object>} existingProjects - Existing portfolio projects array
 *                                           Each project should have a 'title' or 'name' property
 * @param {string[]} [excludedRepoNames=[]] - Additional repo names to exclude
 *
 * @returns {Array<Object>} Filtered array of repository objects that pass all criteria
 *
 * @example
 * const repos = [
 *   { name: 'awesome-app', description: 'My app' },
 *   { name: 'my-portfolio-main', description: 'Portfolio' },
 *   { name: 'api-server', description: 'Backend' }
 * ];
 *
 * const existing = [
 *   { title: 'awesome-app', url: 'https://...' }
 * ];
 *
 * const filtered = filterRepositories(repos, existing, ['api-server']);
 * // Result: [] (awesome-app already exists, my-portfolio-main is excluded, api-server is in excludeList)
 *
 * Deduplication Strategy:
 * - Compare repo names against existing project titles (case-insensitive)
 * - Log filtered-out repos for transparency
 * - Return only repos that pass all filters
 */
function filterRepositories(repos, existingProjects, excludedRepoNames = []) {
  if (!Array.isArray(repos)) {
    console.warn('[githubProcessor] filterRepositories called with non-array repos');
    return [];
  }

  if (!Array.isArray(existingProjects)) {
    existingProjects = [];
  }

  if (!Array.isArray(excludedRepoNames)) {
    excludedRepoNames = [];
  }

  // Create normalized sets for efficient lookups
  const excludedNames = new Set([
    ...EXCLUDED_REPO_NAMES.map((n) => n.toLowerCase()),
    ...excludedRepoNames.map((n) => n.toLowerCase()),
  ]);

  // Create set of existing project titles/URLs (normalized for case-insensitive matching)
  const existingProjectTitles = new Set(
    existingProjects
      .map((p) => (p.title || p.name || '').toLowerCase().trim())
      .filter((t) => t.length > 0)
  );

  const existingProjectUrls = new Set(
    existingProjects
      .map((p) => (p.code || p.html_url || p.url || '').toLowerCase().trim())
      .filter((u) => u.length > 0)
  );

  // Filter repositories
  const filtered = [];

  for (const repo of repos) {
    const repoName = (repo.name || '').toLowerCase().trim();
    const repoUrl = (repo.html_url || '').toLowerCase().trim();
    const description = (repo.description || '').trim();

    // Rule 1: Skip if name is in excluded list
    if (excludedNames.has(repoName)) {
      console.log(`[githubProcessor] Skipping excluded repo: "${repo.name}"`);
      continue;
    }

    // Rule 2: Skip if description is empty/whitespace
    if (!description || description.length === 0) {
      console.log(`[githubProcessor] Skipping repo with no description: "${repo.name}"`);
      continue;
    }

    // Rule 3: Skip if URL already exists in projects (duplicate)
    if (repoUrl && existingProjectUrls.has(repoUrl)) {
      console.log(
        `[githubProcessor] Skipping duplicate repo (URL match): "${repo.name}"`
      );
      continue;
    }

    // Rule 4: Skip if humanized name already exists in projects (case-insensitive)
    // We'll use the humanizeName function from nameHumanizer
    // Import at top of module if not already there
    const humanizedName = humanizeName(repo.name);
    const normalizedHumanized = humanizedName.toLowerCase().trim();

    if (normalizedHumanized && existingProjectTitles.has(normalizedHumanized)) {
      console.log(
        `[githubProcessor] Skipping duplicate repo (title match): "${repo.name}" → "${humanizedName}"`
      );
      continue;
    }

    // If all filters pass, include the repo
    filtered.push(repo);
  }

  console.log(
    `[githubProcessor] Filtered ${repos.length} repos → ${filtered.length} new repos`
  );
  return filtered;
}

/**
 * Transforms a GitHub repository object into a standardized portfolio project entry
 *
 * This function converts GitHub API repository data into the format expected by
 * the portfolio projects array. It extracts relevant information, generates IDs,
 * and creates a consistent project structure.
 *
 * Data Transformation:
 * - GitHub 'name' → project 'title'
 * - GitHub 'description' → project 'description'
 * - GitHub 'html_url' → project 'url'
 * - GitHub 'language' → project 'language'
 * - GitHub 'topics' → project 'tags'
 * - GitHub 'stargazers_count' → project 'stars'
 * - GitHub 'updated_at' → project 'lastUpdated'
 *
 * @function transformToProjectEntry
 * @param {Object} repo - Repository object from GitHub API
 * @param {string} repo.name - Repository name
 * @param {string} [repo.description] - Repository description (optional)
 * @param {string} repo.html_url - GitHub repository URL
 * @param {string} [repo.language] - Primary programming language
 * @param {string[]} [repo.topics] - Repository topics/tags
 * @param {number} [repo.stargazers_count] - Number of stars/watchers
 * @param {string} repo.updated_at - ISO timestamp of last update
 *
 * @returns {Object} Transformed project entry object
 *          {
 *            id: string,                    // Unique identifier (hash-based)
 *            title: string,                 // Repository name in title case
 *            description: string,           // Repository description (fallback: "")
 *            url: string,                   // GitHub repository URL
 *            language: string|null,         // Primary language or null
 *            tags: string[],                // Topics/tags array
 *            stars: number,                 // Star count
 *            lastUpdated: string,           // ISO date string
 *            source: "github"               // Metadata: source of project data
 *          }
 *
 * @example
 * const repo = {
 *   name: 'awesome-widget',
 *   description: 'A powerful widget library',
 *   html_url: 'https://github.com/user/awesome-widget',
 *   language: 'JavaScript',
 *   topics: ['widget', 'library', 'javascript'],
 *   stargazers_count: 42,
 *   updated_at: '2024-01-15T10:30:00Z'
 * };
 *
 * const project = transformToProjectEntry(repo);
 * // Result:
 * // {
 * //   id: 'abc123xyz...',
 * //   title: 'Awesome Widget',
 * //   description: 'A powerful widget library',
 * //   url: 'https://github.com/user/awesome-widget',
 * //   language: 'JavaScript',
 * //   tags: ['widget', 'library', 'javascript'],
 * //   stars: 42,
 * //   lastUpdated: '2024-01-15T10:30:00Z',
 * //   source: 'github'
 * // }
 *
 * ID Generation:
 * - Generate unique ID based on repository name
 * - Use consistent hashing for deterministic IDs
 * - Ensures same repo always gets same ID across runs
 */
function transformToProjectEntry(repo) {
  // Validate repo object structure
  if (!repo || typeof repo !== 'object') {
    throw new Error('[githubProcessor] Invalid repo object');
  }

  if (!repo.name || typeof repo.name !== 'string') {
    throw new Error('[githubProcessor] Repo must have a valid name field');
  }

  // Generate unique ID based on repository name (deterministic hash)
  // Simple hash: use timestamp + name or just use a slug
  const projectId = `github_${repo.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;

  // Humanize the repository name for the title
  const title = humanizeName(repo.name);

  // Extract description (with fallback to empty string)
  const description = (repo.description || '').trim();

  // Build tech stack from language and topics
  const tech = [];

  // Add primary language if available
  if (repo.language && typeof repo.language === 'string') {
    tech.push(repo.language);
  }

  // Add topics if available
  if (Array.isArray(repo.topics)) {
    const topics = repo.topics
      .filter((t) => typeof t === 'string')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    tech.push(...topics);
  }

  // Deduplicate tech stack
  const uniqueTech = [...new Set(tech)];

  // Build project entry object
  const projectEntry = {
    id: projectId,
    title: title,
    desc: description,
    tech: uniqueTech,
    ss: '', // screenshot placeholder (empty for auto-added projects)
    live: '', // live link placeholder (empty for auto-added projects)
    code: repo.html_url || '',
    stars: repo.stargazers_count || 0,
    updated: repo.updated_at || new Date().toISOString(),
    source: 'github',
  };

  // Validate output structure
  if (!projectEntry.title || projectEntry.title.length === 0) {
    throw new Error(`[githubProcessor] Failed to generate title for repo: ${repo.name}`);
  }

  if (!projectEntry.code || projectEntry.code.length === 0) {
    throw new Error(`[githubProcessor] Repo missing html_url: ${repo.name}`);
  }

  console.log(
    `[githubProcessor] Transformed repo: "${repo.name}" → "${projectEntry.title}" [${uniqueTech.join(', ')}]`
  );

  return projectEntry;
}

/**
 * Builds the complete updated projects array by fetching, filtering, and merging
 * GitHub repositories with existing portfolio projects
 *
 * This is the orchestration function that coordinates the entire GitHub integration
 * workflow. It handles the complete process from fetching repos to merging with
 * existing data, with comprehensive error handling.
 *
 * Workflow:
 * 1. Fetch all GitHub repositories for the authenticated user
 * 2. Filter repositories based on exclusion rules
 * 3. Transform filtered repositories to project entries
 * 4. Merge with existing projects (new repos added, existing projects preserved)
 * 5. Return complete updated projects array
 *
 * @async
 * @function buildUpdatedProjects
 * @param {Array<Object>} existingProjects - Current portfolio projects array
 * @param {string} username - GitHub username
 * @param {string} token - GitHub Personal Access Token
 *
 * @returns {Promise<Array<Object>>} Updated projects array containing:
 *          - All existing projects (unchanged)
 *          - New GitHub repositories (transformed to project format)
 *          - Duplicates removed (existing projects have priority)
 *
 * @throws {Error} If GitHub API fails (propagates from fetchGitHubRepos)
 * @throws {Error} If data transformation fails
 *
 * @example
 * const existingProjects = [
 *   { id: '001', title: 'Old Project', url: '...' }
 * ];
 *
 * try {
 *   const updated = await buildUpdatedProjects(
 *     existingProjects,
 *     'octocat',
 *     'ghp_xxxxxxxxxxxx'
 *   );
 *   console.log(`Updated projects: ${updated.length} total`);
 *   console.log(`New from GitHub: ${updated.length - existingProjects.length}`);
 * } catch (error) {
 *   console.error('Failed to update projects:', error.message);
 * }
 *
 * Merge Strategy:
 * - Existing projects are preserved with priority (no overwrites)
 * - New repositories are appended as new project entries
 * - Deduplication prevents same repo from appearing twice
 * - Maintains order: existing projects first, then new ones
 *
 * Error Handling:
 * - Logs detailed error information
 * - Fails fast on critical errors (API unavailable)
 * - Continues operation on transformation errors (logs warning)
 */
async function buildUpdatedProjects(existingProjects, username, token) {
  // Validate parameters
  if (!Array.isArray(existingProjects)) {
    console.warn(
      '[githubProcessor] existingProjects is not an array, using empty array'
    );
    existingProjects = [];
  }

  if (!username || typeof username !== 'string') {
    throw new Error('[githubProcessor] Invalid username parameter');
  }

  if (!token || typeof token !== 'string') {
    throw new Error('[githubProcessor] Invalid token parameter');
  }

  try {
    // Step 1: Fetch repositories from GitHub API
    console.log('[githubProcessor] Step 1: Fetching repositories from GitHub...');
    const repos = await fetchGitHubRepos(username, token);

    // Step 2: Filter repositories based on exclusion rules
    console.log('[githubProcessor] Step 2: Filtering repositories...');
    const filteredRepos = filterRepositories(repos, existingProjects, EXCLUDED_REPO_NAMES);

    // Step 3: Transform filtered repos to project entries
    console.log('[githubProcessor] Step 3: Transforming repositories to project entries...');
    const newProjects = [];

    for (const repo of filteredRepos) {
      try {
        const projectEntry = transformToProjectEntry(repo);
        newProjects.push(projectEntry);
      } catch (error) {
        console.warn(
          `[githubProcessor] Failed to transform repo "${repo.name}": ${error.message}`
        );
        // Continue processing other repos on transformation error
      }
    }

    console.log(
      `[githubProcessor] Successfully transformed ${newProjects.length} repositories`
    );

    // Step 4: Merge with existing projects (existing projects have priority)
    console.log('[githubProcessor] Step 4: Merging with existing projects...');
    const updatedProjects = [...existingProjects, ...newProjects];

    console.log(
      `[githubProcessor] Final project count: ${updatedProjects.length} (${existingProjects.length} existing + ${newProjects.length} new)`
    );

    return updatedProjects;
  } catch (error) {
    console.error(
      `[githubProcessor] Failed to build updated projects: ${error.message}`
    );
    throw error;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  fetchGitHubRepos,
  filterRepositories,
  transformToProjectEntry,
  buildUpdatedProjects,
  GITHUB_API_BASE_URL,
  GITHUB_REPOS_ENDPOINT,
  GITHUB_REQUEST_HEADERS,
  EXCLUDED_REPO_NAMES,
  GITHUB_API_PER_PAGE,
};
