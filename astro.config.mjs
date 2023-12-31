import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";

import purgecss from "astro-purgecss";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), purgecss({
    fontFace: true,
    keyframes: true,
    rejected: true,
    variables: true
  })],
  build: {
    inlineStylesheets: 'always'
  }
});