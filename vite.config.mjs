import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

/**
 * Portfolio Data Build Plugin
 *
 * This plugin runs the portfolio data build script as a pre-build step.
 * It fetches GitHub projects and organizes gallery images before Vite builds.
 *
 * The build is non-blocking: if it fails, Vite continues with existing data.
 * This provides graceful degradation in CI/CD or offline scenarios.
 *
 * @example
 * // Build runs automatically with: npm run build
 * // Or explicitly with: npm run build:portfolio && npm run build
 */
function portfolioBuildPlugin() {
  return {
    name: 'portfolio-build',
    apply: 'build', // Only run on `npm run build`, not on `npm run dev`
    enforce: 'pre', // Run before other plugins
    async configResolved(config) {
      // configResolved hook fires early, allowing us to run pre-build
      try {
        const githubToken = process.env.GITHUB_TOKEN || '';
        const env = { ...process.env };
        if (githubToken) {
          env.GITHUB_TOKEN = githubToken;
        }

        // Suppress output for clean build log (still visible if it errors)
        console.log('[Portfolio] Building project and gallery data...');
        execSync('node scripts/build-portfolio-data.js', {
          cwd: process.cwd(),
          stdio: 'inherit', // Show output
          env
        });

        console.log('[Portfolio] ✅ Portfolio data updated');
      } catch (err) {
        // Non-fatal error: warn but continue with Vite build
        console.warn('[Portfolio] ⚠️  Portfolio build failed, proceeding with existing data');
        console.warn(`[Portfolio] Error: ${err.message}`);
        // Do not throw - allow Vite to continue
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [portfolioBuildPlugin(), react()],
  base: './', // 👈 this fixes the blank page on deployment
})
