import { defineConfig } from 'astro/config';

// GitHub Actions supplies these for both repository and custom-domain hosting.
export default defineConfig({
  site: process.env.SITE_URL || 'https://mebegu.github.io',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
