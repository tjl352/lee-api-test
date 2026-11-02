import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: {
    baseURL: 'https://dogapi.dog/api/v2/',
  },
});
