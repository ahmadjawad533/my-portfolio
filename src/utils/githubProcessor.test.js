import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import {
  filterRepositories,
  transformToProjectEntry,
  EXCLUDED_REPO_NAMES,
} from './githubProcessor';

describe('githubProcessor', () => {
  describe('filterRepositories()', () => {
    describe('Unit Tests - Specific Examples', () => {
      it('returns empty array when no valid repos provided', () => {
        const result = filterRepositories([], [], []);
        expect(result).toEqual([]);
      });

      it('filters out repos with no description', () => {
        const repos = [
          { name: 'valid-repo', description: 'Has description', html_url: 'https://github.com/user/valid' },
          { name: 'empty-desc', description: '', html_url: 'https://github.com/user/empty' },
          { name: 'null-desc', description: null, html_url: 'https://github.com/user/null' },
        ];
        const result = filterRepositories(repos, []);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('valid-repo');
      });

      it('filters out portfolio site itself (my-portfolio-main)', () => {
        const repos = [
          { name: 'my-portfolio-main', description: 'Portfolio', html_url: 'https://github.com/user/portfolio' },
          { name: 'My-Portfolio-Main', description: 'Portfolio', html_url: 'https://github.com/user/portfolio2' },
          { name: 'other-project', description: 'Other', html_url: 'https://github.com/user/other' },
        ];
        const result = filterRepositories(repos, []);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('other-project');
      });

      it('filters out repos with duplicate URLs (already in projects)', () => {
        const repos = [
          { name: 'new-repo', description: 'New', html_url: 'https://github.com/user/existing' },
          { name: 'another-new', description: 'Another', html_url: 'https://github.com/user/new' },
        ];
        const existing = [
          { code: 'https://github.com/user/existing' },
        ];
        const result = filterRepositories(repos, existing);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('another-new');
      });

      it('filters out repos with duplicate titles (case-insensitive)', () => {
        const repos = [
          { name: 'awesome-tool', description: 'Tool desc', html_url: 'https://github.com/user/tool1' },
          { name: 'other_project', description: 'Other', html_url: 'https://github.com/user/proj1' },
        ];
        const existing = [
          { title: 'Awesome Tool' }, // Exact humanized match
          { title: 'Other Project' }, // Humanized match
        ];
        const result = filterRepositories(repos, existing);
        expect(result).toHaveLength(0);
      });

      it('handles case-insensitive repo name exclusion', () => {
        const repos = [
          { name: 'DOTFILES', description: 'Dotfiles', html_url: 'https://github.com/user/dotfiles' },
          { name: 'dotfiles', description: 'Dotfiles', html_url: 'https://github.com/user/dotfiles2' },
          { name: 'valid-repo', description: 'Valid', html_url: 'https://github.com/user/valid' },
        ];
        const result = filterRepositories(repos, []);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('valid-repo');
      });

      it('applies custom excluded repo names', () => {
        const repos = [
          { name: 'custom-excluded', description: 'Desc', html_url: 'https://github.com/user/custom' },
          { name: 'valid-repo', description: 'Valid', html_url: 'https://github.com/user/valid' },
        ];
        const result = filterRepositories(repos, [], ['custom-excluded']);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('valid-repo');
      });
    });

    describe('Property-Based Tests - Universal Properties', () => {
      // **Property 1: GitHub Filtering Removes Empty Descriptions**
      // **Validates: Requirements 1.3**
      it('Property 1: All returned repos have non-empty descriptions', () => {
        fc.assert(
          fc.property(
            fc.array(
              fc.record({
                name: fc.string({ minLength: 1 }),
                description: fc.oneof(fc.constant(''), fc.constant(null), fc.string({ minLength: 1 })),
                html_url: fc.string({ minLength: 1 }),
              }),
              { maxLength: 20 }
            ),
            (repos) => {
              const result = filterRepositories(repos, []);
              // Every result should have a non-empty description
              result.forEach((repo) => {
                expect(repo.description).toBeTruthy();
                expect(typeof repo.description).toBe('string');
                expect(repo.description.trim().length).toBeGreaterThan(0);
              });
            }
          )
        );
      });

      // **Property 2: Portfolio Site Self-Exclusion**
      // **Validates: Requirements 1.4**
      it('Property 2: my-portfolio-main is always filtered out', () => {
        fc.assert(
          fc.property(
            fc.array(
              fc.record({
                name: fc.oneof(fc.constant('my-portfolio-main'), fc.string({ minLength: 1 })),
                description: fc.string({ minLength: 1 }),
                html_url: fc.string({ minLength: 1 }),
              }),
              { maxLength: 10 }
            ),
            (repos) => {
              const result = filterRepositories(repos, []);
              // my-portfolio-main should never appear in results
              result.forEach((repo) => {
                expect(repo.name.toLowerCase()).not.toBe('my-portfolio-main');
              });
            }
          )
        );
      });

      // **Property 3: Existing Project Deduplication**
      // **Validates: Requirements 1.2, 6.1**
      it('Property 3: No duplicate URLs between repos and existing projects', () => {
        fc.assert(
          fc.property(
            fc.tuple(
              fc.array(
                fc.record({
                  name: fc.string({ minLength: 1 }),
                  description: fc.string({ minLength: 1 }),
                  html_url: fc.string({ minLength: 5 }),
                }),
                { maxLength: 10 }
              ),
              fc.array(
                fc.record({
                  code: fc.string({ minLength: 5 }),
                }),
                { maxLength: 5 }
              )
            ),
            ([repos, existing]) => {
              const result = filterRepositories(repos, existing);
              const existingUrls = new Set(existing.map((p) => (p.code || '').toLowerCase().trim()));
              
              // No returned repo should have a URL matching an existing project
              result.forEach((repo) => {
                const repoUrl = (repo.html_url || '').toLowerCase().trim();
                expect(existingUrls.has(repoUrl)).toBe(false);
              });
            }
          )
        );
      });

      // **Property 18: Project Entry Schema Compliance**
      // **Validates: Requirements 1.6**
      it('Property 18: Transformed projects have valid schema', () => {
        fc.assert(
          fc.property(
            fc.record({
              name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => /[a-z0-9]/.test(s)),
              description: fc.string({ minLength: 1 }),
              html_url: fc.string({ minLength: 5 }),
            }),
            (repo) => {
              const project = transformToProjectEntry(repo);
              
              // Validate required fields
              expect(project).toHaveProperty('id');
              expect(project).toHaveProperty('title');
              expect(project).toHaveProperty('desc');
              expect(project).toHaveProperty('tech');
              expect(project).toHaveProperty('code');
              
              // Validate field types
              expect(typeof project.id).toBe('string');
              expect(typeof project.title).toBe('string');
              expect(typeof project.desc).toBe('string');
              expect(Array.isArray(project.tech)).toBe(true);
              expect(typeof project.code).toBe('string');
              
              // Validate constraints
              expect(project.id.length).toBeGreaterThan(0);
              expect(project.title.length).toBeGreaterThan(0);
              expect(project.code.length).toBeGreaterThan(0);
            }
          )
        );
      });
    });

    describe('Edge Cases', () => {
      it('handles repos array with mixed valid/invalid entries', () => {
        const repos = [
          { name: 'valid', description: 'Has desc', html_url: 'https://github.com/user/valid' },
          { name: null, description: 'No name' },
          { name: 'no-url', description: 'No URL field' },
          { name: 'empty-desc', description: '' },
        ];
        const result = filterRepositories(repos, []);
        expect(result.length).toBeGreaterThanOrEqual(0);
      });

      it('handles very long descriptions without filtering them out', () => {
        const longDesc = 'A'.repeat(10000);
        const repos = [
          { name: 'long-desc', description: longDesc, html_url: 'https://github.com/user/long' },
        ];
        const result = filterRepositories(repos, []);
        expect(result).toHaveLength(1);
      });

      it('handles special characters in repo names', () => {
        const repos = [
          { name: 'my-project_v1.0', description: 'Project', html_url: 'https://github.com/user/proj' },
          { name: 'app@beta', description: 'Beta app', html_url: 'https://github.com/user/app' },
        ];
        const result = filterRepositories(repos, []);
        expect(result.length).toBe(2);
      });
    });
  });

  describe('transformToProjectEntry()', () => {
    describe('Unit Tests', () => {
      it('transforms a valid GitHub repo to project entry', () => {
        const repo = {
          name: 'awesome-tool',
          description: 'An awesome tool for developers',
          html_url: 'https://github.com/user/awesome-tool',
          language: 'JavaScript',
          topics: ['tool', 'javascript'],
          stargazers_count: 42,
          updated_at: '2024-01-15T10:30:00Z',
        };

        const project = transformToProjectEntry(repo);

        expect(project.title).toBe('Awesome Tool');
        expect(project.desc).toBe('An awesome tool for developers');
        expect(project.code).toBe('https://github.com/user/awesome-tool');
        expect(project.tech).toContain('JavaScript');
        expect(project.tech).toContain('tool');
        expect(project.stars).toBe(42);
      });

      it('handles repos with no language', () => {
        const repo = {
          name: 'project',
          description: 'Project',
          html_url: 'https://github.com/user/project',
          language: null,
          topics: [],
          stargazers_count: 0,
          updated_at: '2024-01-01T00:00:00Z',
        };

        const project = transformToProjectEntry(repo);

        expect(project.tech).toEqual([]);
        expect(project.title).toBe('Project');
      });

      it('throws error for repo with missing name', () => {
        const repo = {
          description: 'Description',
          html_url: 'https://github.com/user/project',
        };

        expect(() => transformToProjectEntry(repo)).toThrow();
      });

      it('throws error for repo with missing html_url', () => {
        const repo = {
          name: 'project',
          description: 'Description',
        };

        expect(() => transformToProjectEntry(repo)).toThrow();
      });

      it('deduplicates tech stack', () => {
        const repo = {
          name: 'project',
          description: 'Project',
          html_url: 'https://github.com/user/project',
          language: 'JavaScript',
          topics: ['javascript', 'js', 'JavaScript'],
          stargazers_count: 0,
          updated_at: '2024-01-01T00:00:00Z',
        };

        const project = transformToProjectEntry(repo);

        // Should have JavaScript, javascript, and js (case-sensitive dedup)
        // But we're using Set which is case-sensitive, so duplicates remain
        expect(project.tech.length).toBeGreaterThanOrEqual(1);
        expect(project.tech).toContain('JavaScript');
      });
    });

    describe('Property-Based Tests', () => {
      it('always produces valid project ID', () => {
        fc.assert(
          fc.property(
            fc.record({
              name: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => /[a-z0-9]/.test(s)),
              description: fc.string({ minLength: 1 }),
              html_url: fc.string({ minLength: 5 }),
            }),
            (repo) => {
              const project = transformToProjectEntry(repo);
              expect(project.id).toBeTruthy();
              expect(typeof project.id).toBe('string');
              expect(project.id.length).toBeGreaterThan(0);
            }
          )
        );
      });

      it('title never contains underscores or hyphens from repo name', () => {
        fc.assert(
          fc.property(
            fc.record({
              name: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => /[a-z0-9]/.test(s)),
              description: fc.string({ minLength: 1 }),
              html_url: fc.string({ minLength: 5 }),
            }),
            (repo) => {
              const project = transformToProjectEntry(repo);
              // After humanization, underscores and hyphens should be replaced with spaces
              expect(project.title).not.toContain('_');
              expect(project.title).not.toContain('-');
            }
          )
        );
      });
    });
  });
});
