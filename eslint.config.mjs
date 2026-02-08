import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const reactRecommended =
  react.configs?.flat?.recommended ?? {
    plugins: { react },
    rules: react.configs?.recommended?.rules ?? {},
  };

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/.next/**",
      "**/next-env.d.ts",
      "**/public/mockServiceWorker.js",
      ".pnpm/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactRecommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite(),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    files: ["apps/web-next/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: [
      "apps/docs/**/*.{ts,tsx}",
      "apps/web-react/**/*.{ts,tsx}",
      "apps/web-next/**/*.{ts,tsx}",
    ],
    languageOptions: {
      parserOptions: {
        project: [
          "apps/docs/tsconfig.app.json",
          "apps/docs/tsconfig.node.json",
          "apps/web-react/tsconfig.app.json",
          "apps/web-react/tsconfig.node.json",
          "apps/web-next/tsconfig.json",
        ],
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ["**/*.{cjs,js,ts,mjs}"],
    ignores: ["apps/**/*"],
    languageOptions: {
      globals: globals.node,
    },
  },
];
