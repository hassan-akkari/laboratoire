// Tailwind CSS v4 is wired purely through this PostCSS plugin — no tailwind.config.*.
// The plugin reads @import "tailwindcss", @theme, @source etc. directly from
// app/globals.css at build time.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
