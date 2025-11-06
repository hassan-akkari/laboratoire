/* Root ESLint (monorepo) */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  // ⬇️ NIENTE "project" QUI AL ROOT
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname, // sicurezza a livello root
  },
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  ignorePatterns: ["**/dist/**", "**/node_modules/**", ".pnpm/**"],
  overrides: [
    // WEB-REACT (type-aware)
    {
      "files": ["apps/web-react/**/*.{ts,tsx}"],
      parserOptions: {
        // ⬇️ qui sì: progetto specifico dell’app
        project: [
          "apps/web-react/tsconfig.app.json",
          "apps/web-react/tsconfig.node.json",
        ],
        tsconfigRootDir: __dirname,
      },
      settings: { react: { version: "detect" } },
      rules: {},
    },
    // DOCS (type-aware)
    {
      "files": ["apps/docs/**/*.{ts,tsx}"],
      parserOptions: {
        project: ["apps/docs/tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      settings: { react: { version: "detect" } },
      rules: {},
    },
    // opzionale: se hai file TS “di root” (scripts, ecc.)
    {
      "files": ["*.ts", "*.tsx"],
      parserOptions: {
        project: null, // lint “non type-aware” per i TS sparsi al root
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
