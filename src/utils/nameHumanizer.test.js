import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import { humanizeName, ensureUniqueTitle } from './nameHumanizer';

describe('humanizeName()', () => {
  describe('Unit Tests - Specific Examples', () => {
    it('converts underscores to spaces and applies title case: "Tick_Tack_Toe" → "Tick Tack Toe"', () => {
      expect(humanizeName('Tick_Tack_Toe')).toBe('Tick Tack Toe');
    });

    it('converts hyphens to spaces and applies title case: "AWS-Campus-Help-Assistant" → "AWS Campus Help Assistant"', () => {
      expect(humanizeName('AWS-Campus-Help-Assistant')).toBe('AWS Campus Help Assistant');
    });

    it('preserves all-caps acronyms and converts hyphens: "CRUD-API" → "CRUD API"', () => {
      expect(humanizeName('CRUD-API')).toBe('CRUD API');
    });

    it('handles mixed case with underscores: "machine_learning_model" → "Machine Learning Model"', () => {
      expect(humanizeName('machine_learning_model')).toBe('Machine Learning Model');
    });

    it('preserves acronyms in mixed names: "WebSocket-Handler" → "Websocket Handler"', () => {
      expect(humanizeName('WebSocket-Handler')).toBe('Websocket Handler');
    });

    it('handles single-word names: "Hello" → "Hello"', () => {
      expect(humanizeName('Hello')).toBe('Hello');
    });

    it('handles names with numbers: "Python3-Tutorial" → "Python3 Tutorial"', () => {
      expect(humanizeName('Python3-Tutorial')).toBe('Python3 Tutorial');
    });

    it('handles multiple consecutive separators: "API__Gateway--Tool" → "API Gateway Tool"', () => {
      expect(humanizeName('API__Gateway--Tool')).toBe('API Gateway Tool');
    });

    it('handles single character words: "A_B_C" → "A B C"', () => {
      expect(humanizeName('A_B_C')).toBe('A B C');
    });

    it('returns empty string for empty input', () => {
      expect(humanizeName('')).toBe('');
    });

    it('returns empty string for whitespace-only input', () => {
      expect(humanizeName('   ')).toBe('');
    });

    it('handles names starting with separators: "_test_name" → "Test Name"', () => {
      expect(humanizeName('_test_name')).toBe('Test Name');
    });

    it('handles names ending with separators: "test_name_" → "Test Name"', () => {
      expect(humanizeName('test_name_')).toBe('Test Name');
    });

    it('handles all lowercase: "hello_world" → "Hello World"', () => {
      expect(humanizeName('hello_world')).toBe('Hello World');
    });

    it('handles all uppercase single words as acronyms: "HELLO_WORLD" → "HELLO WORLD" (each word treated separately)', () => {
      // HELLO is length 5, all-caps, so it's treated as an acronym
      // WORLD is length 5, all-caps, so it's treated as an acronym
      expect(humanizeName('HELLO_WORLD')).toBe('HELLO WORLD');
    });

    it('handles mixed case acronyms: "api-GATEWAY-tool" → "Api GATEWAY Tool"', () => {
      expect(humanizeName('api-GATEWAY-tool')).toBe('Api GATEWAY Tool');
    });

    it('handles null gracefully', () => {
      expect(humanizeName(null)).toBe('');
    });

    it('handles undefined gracefully', () => {
      expect(humanizeName(undefined)).toBe('');
    });

    it('handles version numbers: "API_Gateway_v2" → "API Gateway V2"', () => {
      expect(humanizeName('API_Gateway_v2')).toBe('API Gateway V2');
    });
  });

  describe('Property-Based Tests - Universal Properties', () => {
    // **Validates: Requirements 2.1, 2.2, 2.3**

    it('Property 1: No underscores in output (Validates: Requirement 2.1)', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result = humanizeName(input);
          expect(result).not.toContain('_');
        })
      );
    });

    it('Property 2: No hyphens in output (Validates: Requirement 2.2)', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result = humanizeName(input);
          expect(result).not.toContain('-');
        })
      );
    });

    it('Property 3: No multiple consecutive spaces (Validates: Requirement 2.3)', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result = humanizeName(input);
          expect(result).not.toMatch(/  /);
        })
      );
    });

    it('Property 4: Result is always trimmed (no leading/trailing spaces)', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result = humanizeName(input);
          expect(result).toBe(result.trim());
        })
      );
    });

    it('Property 5: Idempotence - repeated calls produce same result', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result1 = humanizeName(input);
          const result2 = humanizeName(result1);
          const result3 = humanizeName(result2);
          expect(result2).toBe(result3);
          // Once humanized, applying again should produce same result
          if (result1.length > 0) {
            expect(result2).toBe(result1);
          }
        })
      );
    });

    it('Property 6: Empty input produces empty output', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          if (!input || !input.trim()) {
            expect(humanizeName(input)).toBe('');
          }
        })
      );
    });

    it('Property 7: Non-empty input produces non-empty output when it contains alphanumeric chars', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).filter((s) => /[a-zA-Z0-9]/.test(s)),
          (input) => {
            const result = humanizeName(input);
            expect(result.length).toBeGreaterThan(0);
          }
        )
      );
    });

    it('Property 8: Single word names (no separators) are title-cased correctly', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-zA-Z0-9]+$/),
          (word) => {
            const result = humanizeName(word);
            // Result should have no underscores or hyphens
            expect(result).not.toContain('_');
            expect(result).not.toContain('-');
            // If word has lowercase letters, the result should have first letter capitalized
            // (unless the first character is a number, in which case it stays as is)
            if (/[a-z]/.test(word) && /^[a-zA-Z]/.test(word)) {
              expect(/^[A-Z]/.test(result) || result === '').toBe(true);
            }
          }
        )
      );
    });

    it('Property 9: Acronyms (all-caps, length > 1) are preserved', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.stringMatching(/^[A-Z]{2,}$/), // 2+ uppercase letters
            fc.stringMatching(/^[a-z]+$/)      // lowercase letters
          ),
          ([acronym, word]) => {
            const input = `${acronym}-${word}`;
            const result = humanizeName(input);
            // The acronym should still be in the result as all-caps
            expect(result).toContain(acronym);
            expect(result).not.toContain('-');
          }
        )
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters and numbers', () => {
      expect(humanizeName('test@project#1')).toBe('Test@project#1');
    });

    it('handles only separators input', () => {
      expect(humanizeName('___---')).toBe('');
    });

    it('handles names with spaces (pre-existing)', () => {
      expect(humanizeName('Hello World')).toBe('Hello World');
    });

    it('handles mixed separators and spaces', () => {
      expect(humanizeName('Hello_World-Test')).toBe('Hello World Test');
    });

    it('handles very long names', () => {
      const longName = 'This_is_a_very_long_project_name_with_many_words'.split('_').join('_');
      const result = humanizeName(longName);
      expect(result).not.toContain('_');
      expect(result).toMatch(/^[A-Z]/);
    });
  });
});

describe('ensureUniqueTitle()', () => {
  describe('Unit Tests - Specific Examples', () => {
    it('returns title as-is when no collision exists', () => {
      const projects = [{ title: 'CRUD API' }];
      const result = ensureUniqueTitle('New Project', projects);
      expect(result).toBe('New Project');
    });

    it('appends (v2) when exact title collision exists', () => {
      const projects = [{ title: 'CRUD API' }];
      const result = ensureUniqueTitle('CRUD API', projects);
      expect(result).toBe('CRUD API (v2)');
    });

    it('handles case-insensitive collision detection', () => {
      const projects = [{ title: 'crud api' }];
      const result = ensureUniqueTitle('CRUD API', projects);
      expect(result).toBe('CRUD API (v2)');
    });

    it('appends (v3) when (v2) already exists', () => {
      const projects = [
        { title: 'CRUD API' },
        { title: 'CRUD API (v2)' },
      ];
      const result = ensureUniqueTitle('CRUD API', projects);
      expect(result).toBe('CRUD API (v3)');
    });

    it('handles multiple collisions in sequence', () => {
      const projects = [
        { title: 'API Gateway' },
        { title: 'API Gateway (v2)' },
        { title: 'API Gateway (v3)' },
      ];
      const result = ensureUniqueTitle('API Gateway', projects);
      expect(result).toBe('API Gateway (v4)');
    });

    it('returns empty string for empty title input', () => {
      const projects = [{ title: 'Something' }];
      const result = ensureUniqueTitle('', projects);
      expect(result).toBe('');
    });

    it('handles null projects array gracefully', () => {
      const result = ensureUniqueTitle('Test Project', null);
      expect(result).toBe('Test Project');
    });

    it('handles undefined projects array gracefully', () => {
      const result = ensureUniqueTitle('Test Project', undefined);
      expect(result).toBe('Test Project');
    });

    it('handles empty projects array', () => {
      const result = ensureUniqueTitle('New Project', []);
      expect(result).toBe('New Project');
    });

    it('supports custom disambiguator string', () => {
      const projects = [{ title: 'Duplicate' }];
      const result = ensureUniqueTitle('Duplicate', projects, 'copy');
      expect(result).toBe('Duplicate (copy)');
    });

    it('handles projects array with mixed title/name properties', () => {
      const projects = [
        { title: 'Project A', name: 'proj-a' },
        { name: 'Test Project' }, // Only name, no title
      ];
      const result = ensureUniqueTitle('Test Project', projects);
      expect(result).toBe('Test Project (v2)');
    });

    it('ignores projects with empty titles', () => {
      const projects = [
        { title: '' },
        { title: null },
        { name: '' },
      ];
      const result = ensureUniqueTitle('New Project', projects);
      expect(result).toBe('New Project');
    });

    it('handles titles with special characters', () => {
      const projects = [{ title: 'App v1.0' }];
      const result = ensureUniqueTitle('App v1.0', projects);
      expect(result).toBe('App v1.0 (v2)');
    });

    it('handles projects with uppercase title collisions', () => {
      const projects = [{ title: 'MY_PROJECT' }];
      const result = ensureUniqueTitle('my_project', projects);
      expect(result).toBe('my_project (v2)');
    });
  });

  describe('Property-Based Tests - Universal Properties', () => {
    // **Property 5: Unique Title Generation**
    // **Validates: Requirements 2.4, 6.2**

    it('Property 5.1: Returned title never matches existing titles (case-insensitive)', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.string({ minLength: 1 }),
            fc.array(fc.record({
              title: fc.string()
            }), { minLength: 0, maxLength: 10 })
          ),
          ([inputTitle, existingProjects]) => {
            const result = ensureUniqueTitle(inputTitle, existingProjects);
            const resultLower = result.toLowerCase();
            const existingLower = existingProjects.map(p => (p.title || '').toLowerCase());
            
            // Result should not match any existing title
            expect(existingLower).not.toContain(resultLower);
          }
        )
      );
    });

    it('Property 5.2: Empty input produces empty output', () => {
      fc.assert(
        fc.property(
          fc.array(fc.record({ title: fc.string() })),
          (projects) => {
            const result = ensureUniqueTitle('', projects);
            expect(result).toBe('');
          }
        )
      );
    });

    it('Property 5.3: Non-empty input with no collision returns input unchanged', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.string({ minLength: 1 }),
            fc.array(
              fc.record({ title: fc.string() }),
              { minLength: 0, maxLength: 5 }
            )
          ),
          ([title, projects]) => {
            // Filter projects to ensure no collision
            const filtered = projects.filter(
              p => (p.title || '').toLowerCase() !== title.toLowerCase()
            );
            const result = ensureUniqueTitle(title, filtered);
            
            // If no collision, result should be unchanged
            expect(result).toBe(title);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 5.4: Multiple collisions generate incrementing version numbers', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 10 }),
          (numCollisions) => {
            // Create projects with colliding titles: "Test", "Test (v2)", "Test (v3)", etc.
            const projects = [];
            projects.push({ title: 'Test' });
            for (let i = 2; i <= numCollisions; i++) {
              projects.push({ title: `Test (v${i})` });
            }

            const result = ensureUniqueTitle('Test', projects);
            
            // Result should be "Test (v{numCollisions+1})"
            expect(result).toBe(`Test (v${numCollisions + 1})`);
          }
        )
      );
    });

    it('Property 5.5: Result is unique regardless of input case', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          (baseTitle) => {
            const projects = [{ title: baseTitle }];
            
            // Try different case variations of the same title
            const result1 = ensureUniqueTitle(baseTitle, projects);
            const result2 = ensureUniqueTitle(baseTitle.toUpperCase(), projects);
            const result3 = ensureUniqueTitle(baseTitle.toLowerCase(), projects);

            // All results should be unique from the existing title
            // (unless baseTitle is whitespace-only, which gets handled as empty)
            if (baseTitle.trim().length > 0) {
              expect(result1.toLowerCase()).not.toBe(baseTitle.toLowerCase());
              expect(result2.toLowerCase()).not.toBe(baseTitle.toLowerCase());
              expect(result3.toLowerCase()).not.toBe(baseTitle.toLowerCase());
            }
          }
        )
      );
    });

    it('Property 5.6: Disambiguator is always appended on collision', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }).filter((s) => /^[a-zA-Z0-9\s-]+$/.test(s)),
          (title) => {
            const projects = [{ title }];
            const result = ensureUniqueTitle(title, projects, 'alt');

            // If there's a collision, result should differ from input
            if (title.trim().length > 0) {
              expect(result).not.toBe(title);
              expect(result.toLowerCase()).not.toBe(title.toLowerCase());
            }
          }
        )
      );
    });

    it('Property 5.7: Null/undefined inputs handled gracefully', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(null),
            fc.constant(undefined)
          ),
          (projects) => {
            const result = ensureUniqueTitle('Test', projects);
            expect(result).toBe('Test');
          }
        )
      );
    });

    it('Property 5.8: Case-insensitive collision detection works consistently', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          (title) => {
            const projects = [{ title: title.toUpperCase() }];
            const result = ensureUniqueTitle(title.toLowerCase(), projects);

            // Result should not match existing title (case-insensitive)
            expect(result.toLowerCase()).not.toBe(title.toLowerCase());
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles very long titles', () => {
      const longTitle = 'A'.repeat(1000);
      const projects = [{ title: longTitle }];
      const result = ensureUniqueTitle(longTitle, projects);
      expect(result).toContain(longTitle);
      expect(result).toContain('(v2)');
    });

    it('handles titles with only whitespace', () => {
      const projects = [{ title: '   ' }];
      const result = ensureUniqueTitle('Test', projects);
      expect(result).toBe('Test');
    });

    it('handles projects array with mixed valid/invalid entries', () => {
      const projects = [
        { title: 'Valid' },
        { name: 'OnlyName' },
        { title: null },
        { title: undefined },
        {},
      ];
      const result = ensureUniqueTitle('Another', projects);
      expect(result).toBe('Another');
    });
  });
});
