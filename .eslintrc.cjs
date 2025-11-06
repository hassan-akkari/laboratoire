/* Root ESLint (monorepo) */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  // ⬇️ niente "project" qui al root
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
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
      files: ["apps/web-react/**/*.{ts,tsx}"],
      parserOptions: {
        project: [
          "apps/web-react/tsconfig.app.json",
          "apps/web-react/tsconfig.node.json",
        ],
        tsconfigRootDir: __dirname,
      },
      settings: { react: { version: "detect" } },
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
      },
    },
    // DOCS (type-aware)
    {
      files: ["apps/docs/**/*.{ts,tsx}"],
      parserOptions: {
        project: ["apps/docs/tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      settings: { react: { version: "detect" } },
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
      },
    },
    // opzionale: TS “di root” (non type-aware, nessun `project`)
    {
      files: ["*.ts", "*.tsx"],
    },
    // opzionale: Node per config/scripts
    {
      files: ["**/*.{cjs,js,ts,mjs}"],
      excludedFiles: ["apps/**/*"],
      env: { node: true, es2022: true },
    },
  ],
};
