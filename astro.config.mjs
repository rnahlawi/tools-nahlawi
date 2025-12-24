import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    vue(),
    sitemap()
  ],
  site: 'https://tools.nahlawi.com',
  base: '/',
  output: 'static',
  build: {
    assets: '_astro'
  }
});