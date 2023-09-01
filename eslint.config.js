import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";
import storybook from "eslint-plugin-storybook";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import js from "@eslint/js";
import globals from "globals";

const files = ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"];
const ignores = ["dist/**", "node_modules/**", "bin/**", "build/**"];

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores,
    files,
    plugins: {
      "react-refresh": reactRefresh,
      prettier,
      storybook,
      tailwindcss,
      "react-hooks": reactHooks,
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs["eslint-recommended"].rules,
      ...ts.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      //...tailwindcss.configs.recommended.rules,
      ...storybook.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ...reactRecommended,
    rules: {
      "react/prop-types": "off",
    },
  },
  {
    ...reactJsxRuntime,
  },
];
