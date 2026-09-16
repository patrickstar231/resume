import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser', outputDir:'.verification/test-results',
  use:{ baseURL:'http://127.0.0.1:4173', browserName:'chromium', channel:'chromium', viewport:{ width:1440,height:900 } },
  webServer:{ command:'npm run preview -- --port 4173', port:4173, reuseExistingServer:true },
  reporter:'list',
});
