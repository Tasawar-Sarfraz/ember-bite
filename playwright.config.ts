import {defineConfig,devices} from '@playwright/test';
// This configuration never starts a preview server. Supply an approved QA URL.
export default defineConfig({testDir:'tests/browser',fullyParallel:false,use:{baseURL:process.env.QA_BASE_URL||'http://127.0.0.1:5173',trace:'retain-on-failure'},projects:[{name:'desktop-chromium',use:{...devices['Desktop Chrome']}},{name:'mobile-chromium',use:{...devices['Pixel 7']}}]});
