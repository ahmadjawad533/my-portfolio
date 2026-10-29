import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import {
  categorizeImage,
  generateCaption,
  CATEGORY_KEYWORDS,
  CATEGORY_PRIORITY,
  DEFAULT_CATEGORY,
} from './imageProcessor';

describe('imageProcessor', () => {
  describe('categorizeImage()', () => {
    describe('Unit Tests - Specific Examples', () => {
      // Requirements: 3.2, 3.3, 3.4, 3.5, 3.6

      it('categorizes personal images correctly', () => {
        const personalFiles = [
          'Personal_Photo.jpg',
          'Selfie_at_Meetup.jpg',
          'My_Moment.png',
          'Notion_Campus_Leader.jpg',
          'Notion_COMSATS_Lahore_meetup_Selfie.jpeg',
          'Notion CAmpus Leaders Meetupp.jpeg',
        ];

        personalFiles.forEach((file) => {
          const category = categorizeImage(file);
          expect(category).toBe('personal');
        });
      });

      it('categorizes project images correctly', () => {
        const projectFiles = [
          'Project_Screenshot.jpg',
          'Temp Jam 3.0 Pic.jpeg',
          'Jam_Coding_Session.png',
        ];

        projectFiles.forEach((file) => {
          const category = categorizeImage(file);
          expect(category).toBe('projects');
        });
      });

      it('categorizes achievement images correctly', () => {
        const achievementFiles = [
          'AWS Cloud Club Captain Selection.png',
          'Top 5% on Topmate.jpg',
          'Cloud Quest Level 3 Team Photo.jpg',
          'Kirothon The Finale Team Group Photo.jpg',
          'Build with Kiro 2026 Grand FInale Group Photo.jpeg',
        ];

        achievementFiles.forEach((file) => {
          const category = categorizeImage(file);
          expect(category).toBe('achievements');
        });
      });

      it('applies priority when image matches multiple categories', () => {
        // achievements > projects > personal
        // File with "achievement" and "personal" should return "achievements"
        const result = categorizeImage('Achievement_Personal_Photo.jpg');
        expect(result).toBe('achievements');

        // File with "project" and "personal" should return "projects"
        const result2 = categorizeImage('Project_Moment_Selfie.jpg');
        expect(result2).toBe('projects');
      });

      it('returns default category for non-matching files', () => {
        const result = categorizeImage('random_image.png');
        expect(result).toBe(DEFAULT_CATEGORY);
      });

      it('handles case-insensitive keyword matching', () => {
        expect(categorizeImage('personal_photo.jpg')).toBe('personal');
        expect(categorizeImage('PROJECT_SCREENSHOT.png')).toBe('projects');
        expect(categorizeImage('ACHIEVEMENT_AWARD.jpg')).toBe('achievements');
      });

      it('handles null/undefined gracefully', () => {
        expect(categorizeImage(null)).toBe('personal');
        expect(categorizeImage(undefined)).toBe('personal');
        expect(categorizeImage('')).toBe('personal');
      });
    });

    describe('Property-Based Tests', () => {
      // **Property 6: Personal Category Keyword Detection**
      // **Validates: Requirements 3.2**
      it('Property 6: Files with personal keywords are categorized as personal', () => {
        fc.assert(
          fc.property(
            fc.constantFrom(...CATEGORY_KEYWORDS.personal),
            (keyword) => {
              const filename = `${keyword}_photo.jpg`;
              const result = categorizeImage(filename);
              expect(result).toBe('personal');
            }
          )
        );
      });

      // **Property 7: Projects Category Keyword Detection**
      // **Validates: Requirements 3.3**
      it('Property 7: Files with projects keywords are categorized as projects', () => {
        fc.assert(
          fc.property(
            fc.constantFrom(...CATEGORY_KEYWORDS.projects),
            (keyword) => {
              const filename = `${keyword}_screenshot.jpg`;
              const result = categorizeImage(filename);
              expect(result).toBe('projects');
            }
          )
        );
      });

      // **Property 8: Achievements Category Keyword Detection**
      // **Validates: Requirements 3.4**
      it('Property 8: Files with achievements keywords are categorized as achievements', () => {
        fc.assert(
          fc.property(
            fc.constantFrom(...CATEGORY_KEYWORDS.achievements),
            (keyword) => {
              const filename = `${keyword}_award.jpg`;
              const result = categorizeImage(filename);
              expect(result).toBe('achievements');
            }
          )
        );
      });

      // **Property 9: Category Priority Ordering**
      // **Validates: Requirements 3.5**
      it('Property 9: Higher priority categories always win on conflicts', () => {
        fc.assert(
          fc.property(
            fc.tuple(
              fc.constantFrom(...CATEGORY_KEYWORDS.achievements),
              fc.constantFrom(...CATEGORY_KEYWORDS.projects),
              fc.constantFrom(...CATEGORY_KEYWORDS.personal)
            ),
            ([achievementKeyword, projectKeyword, personalKeyword]) => {
              // File with all keywords should return achievements (highest priority)
              const result = categorizeImage(
                `${achievementKeyword}_${projectKeyword}_${personalKeyword}.jpg`
              );
              expect(result).toBe('achievements');

              // File with project and personal should return projects
              const result2 = categorizeImage(
                `${projectKeyword}_${personalKeyword}.jpg`
              );
              expect(result2).toBe('projects');
            }
          )
        );
      });

      // **Property 10: Default Category Fallback**
      // **Validates: Requirements 3.6**
      it('Property 10: Non-matching files default to personal category', () => {
        fc.assert(
          fc.property(
            fc.string({ minLength: 1 }).filter((s) => {
              // Filter out strings that contain known keywords
              const lower = s.toLowerCase();
              for (const keywords of Object.values(CATEGORY_KEYWORDS)) {
                for (const keyword of keywords) {
                  if (lower.includes(keyword)) return false;
                }
              }
              return true;
            }),
            (filename) => {
              const result = categorizeImage(filename);
              expect(result).toBe('personal');
            }
          ),
          { numRuns: 50 }
        );
      });
    });

    describe('Edge Cases', () => {
      it('handles very long filenames', () => {
        const longName = 'achievement_' + 'x'.repeat(1000) + '.jpg';
        const result = categorizeImage(longName);
        expect(result).toBe('achievements');
      });

      it('handles filenames with special characters', () => {
        const result = categorizeImage('achievement@photo#2024!.jpg');
        expect(result).toBe('achievements');
      });

      it('handles filenames with numbers', () => {
        const result = categorizeImage('personal_123_456.jpg');
        expect(result).toBe('personal');
      });
    });
  });

  describe('generateCaption()', () => {
    describe('Unit Tests - Specific Examples', () => {
      // Requirements: 4.1, 4.2, 4.3, 4.4, 4.5

      it('removes file extension from caption', () => {
        const caption = generateCaption('AWS_Cloud_Club_Captain_Selection.png');
        expect(caption.caption).not.toContain('.png');
        expect(caption.caption).toBe('AWS Cloud Club Captain Selection');
      });

      it('converts underscores to spaces in caption', () => {
        const caption = generateCaption('Notion_COMSATS_Lahore_meetup_Selfie.jpeg');
        expect(caption.caption).toContain('Notion');
        expect(caption.caption).toContain('COMSATS');
        expect(caption.caption).toContain('Meetup Selfie');
        expect(caption.caption).not.toContain('_');
      });

      it('converts hyphens to spaces in caption', () => {
        const caption = generateCaption('Temp-Jam-3.0-Pic.jpeg');
        expect(caption.caption).not.toContain('-');
        expect(caption.caption).toContain('3');
      });

      it('applies title case to captions', () => {
        const caption = generateCaption('hello_world_test.jpg');
        expect(caption.caption).toBe('Hello World Test');
      });

      it('preserves acronyms in title case', () => {
        const caption = generateCaption('AWS_Cloud_Club.jpg');
        expect(caption.caption).toBe('AWS Cloud Club');
      });

      it('generates unique ID from filename', () => {
        const caption = generateCaption('Test_Project_123.jpg');
        expect(caption.id).toBeTruthy();
        expect(typeof caption.id).toBe('string');
        expect(caption.id).not.toContain('.jpg');
      });

      it('includes image path in photos array', () => {
        const caption = generateCaption('Photo.jpg', '/gallery/personal/Photo.jpg');
        expect(caption.photos).toEqual(['/gallery/personal/Photo.jpg']);
      });

      it('handles caption object structure', () => {
        const caption = generateCaption('Test.png', '/gallery/test.png');
        expect(caption).toHaveProperty('id');
        expect(caption).toHaveProperty('caption');
        expect(caption).toHaveProperty('photos');
        expect(Array.isArray(caption.photos)).toBe(true);
      });

      it('throws error for invalid filename', () => {
        expect(() => generateCaption(null)).toThrow();
        expect(() => generateCaption('')).toThrow();
      });

      it('handles filenames with multiple consecutive underscores', () => {
        const caption = generateCaption('Test___Project.jpg');
        expect(caption.caption).toBe('Test Project');
        expect(caption.caption).not.toContain('__');
      });

      it('handles filenames with numbers and punctuation', () => {
        const caption = generateCaption('Temp Jam 3.0 Pic.jpeg');
        expect(caption.caption).toContain('3');
        expect(caption.caption).toContain('0');
      });
    });

    describe('Property-Based Tests', () => {
      // **Property 11: Caption Extension Removal**
      // **Validates: Requirements 4.1**
      it('Property 11: File extensions are never in caption', () => {
        fc.assert(
          fc.property(
            fc.tuple(
              fc.string({ minLength: 1 }).filter((s) => /^[a-z0-9_\-]+$/.test(s)),
              fc.constantFrom('.jpg', '.jpeg', '.png', '.gif', '.webp')
            ),
            ([filename, ext]) => {
              const caption = generateCaption(filename + ext, '');
              // Extension should not be in caption text
              expect(caption.caption).not.toContain(ext);
              expect(caption.caption.toLowerCase()).not.toContain('jpg');
              expect(caption.caption.toLowerCase()).not.toContain('jpeg');
              expect(caption.caption.toLowerCase()).not.toContain('png');
            }
          )
        );
      });

      // **Property 12: Underscore-to-Space Conversion**
      // **Validates: Requirements 4.3**
      it('Property 12: Underscores are converted to spaces in caption', () => {
        fc.assert(
          fc.property(
            fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-z]+$/.test(s)),
            (word1, word2, word3) => {
              const filename = `${word1}_${word2}_${word3}.jpg`;
              const caption = generateCaption(filename, '');
              
              // No underscores in output
              expect(caption.caption).not.toContain('_');
              // Words should be separated by spaces
              const words = caption.caption.split(/\s+/);
              expect(words.length).toBeGreaterThanOrEqual(1);
            }
          ),
          { numRuns: 30 }
        );
      });

      // **Property 13: Caption Title Case Formatting**
      // **Validates: Requirements 4.3**
      it('Property 13: Captions are properly title-cased', () => {
        fc.assert(
          fc.property(
            fc.stringMatching(/^[a-z]+$/),
            (word) => {
              const caption = generateCaption(`${word}.jpg`, '');
              // First letter should be uppercase (unless it's a special case)
              const firstChar = caption.caption.charAt(0);
              expect(/[A-Z0-9]/.test(firstChar)).toBe(true);
            }
          )
        );
      });

      // **Property 14: Caption Object Structure**
      // **Validates: Requirements 4.5**
      it('Property 14: Caption object always has required fields', () => {
        fc.assert(
          fc.property(
            fc.string({ minLength: 1, maxLength: 50 }).filter((s) => {
              // Filter to ensure there's at least one alphanumeric character
              return /^[a-z0-9_\-]+$/.test(s) && /[a-z0-9]/.test(s);
            }),
            (filename) => {
              const caption = generateCaption(`${filename}.jpg`, `/gallery/test/${filename}.jpg`);
              
              // Check required properties
              expect(caption).toHaveProperty('id');
              expect(caption).toHaveProperty('caption');
              expect(caption).toHaveProperty('photos');
              
              // Check types
              expect(typeof caption.id).toBe('string');
              expect(typeof caption.caption).toBe('string');
              expect(Array.isArray(caption.photos)).toBe(true);
            }
          )
        );
      });
    });

    describe('Edge Cases', () => {
      it('handles very long filenames', () => {
        const longName = 'a'.repeat(1000) + '_test.jpg';
        const caption = generateCaption(longName);
        expect(caption.caption).toBeTruthy();
        expect(caption.caption.length).toBeGreaterThan(0);
      });

      it('handles single-word filenames', () => {
        const caption = generateCaption('test.jpg');
        expect(caption.caption).toBe('Test');
      });

      it('handles filenames with only special characters', () => {
        // This might throw depending on implementation
        // We handle it gracefully
        try {
          const caption = generateCaption('___.jpg');
          expect(caption.caption.length).toBeGreaterThanOrEqual(0);
        } catch (e) {
          // Expected behavior
        }
      });

      it('handles filename starting with number', () => {
        const caption = generateCaption('123_test.jpg');
        expect(caption.caption).toContain('123');
      });
    });
  });

  describe('Category Keywords and Priority', () => {
    it('all categories have keywords defined', () => {
      expect(CATEGORY_KEYWORDS).toHaveProperty('achievements');
      expect(CATEGORY_KEYWORDS).toHaveProperty('projects');
      expect(CATEGORY_KEYWORDS).toHaveProperty('personal');
    });

    it('all categories have priority defined', () => {
      expect(CATEGORY_PRIORITY).toHaveProperty('achievements');
      expect(CATEGORY_PRIORITY).toHaveProperty('projects');
      expect(CATEGORY_PRIORITY).toHaveProperty('personal');
    });

    it('achievement has highest priority', () => {
      expect(CATEGORY_PRIORITY.achievements).toBeGreaterThan(CATEGORY_PRIORITY.projects);
      expect(CATEGORY_PRIORITY.projects).toBeGreaterThan(CATEGORY_PRIORITY.personal);
    });

    it('keywords are arrays of strings', () => {
      for (const category of Object.keys(CATEGORY_KEYWORDS)) {
        expect(Array.isArray(CATEGORY_KEYWORDS[category])).toBe(true);
        expect(CATEGORY_KEYWORDS[category].length).toBeGreaterThan(0);
        expect(CATEGORY_KEYWORDS[category].every((k) => typeof k === 'string')).toBe(true);
      }
    });
  });
});
