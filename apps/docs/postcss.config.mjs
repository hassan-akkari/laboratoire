// Tailwind CSS v4 is wired purely through this PostCSS plugin (no
// tailwind.config.*): the plugin reads `@import "tailwindcss"`, `@theme`,
// `@source`, `@custom-variant`, ... directly from the imported stylesheets at
// build time. Kept explicit (not auto-detected) for legibility — same VARIANT B
// choice as apps/web-next/postcss.config.mjs.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
