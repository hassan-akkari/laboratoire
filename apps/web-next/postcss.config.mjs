// Explicit PostCSS config for web-next (VARIANT B: explicit-config, not auto-detected).
//
// Tailwind CSS v4 in Next.js is wired purely through this PostCSS plugin — there is
// no `tailwind.config.*` and no `@tailwindcss/vite`. The plugin reads the `@import
// "tailwindcss"`, `@layer`, `@source`, `@theme`, `@utility`, and `@custom-variant`
// directives directly from `app/globals.css` at build time. Keeping the config here
// (and committed) makes the toolchain legible to a future maintainer instead of
// relying on Next's implicit detection.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
