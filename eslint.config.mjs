import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "dist/**", "node_modules/**", "next-env.d.ts"]),

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [
            { pattern: "@/api/**", group: "internal", position: "before" },
            { pattern: "@/components/**", group: "internal", position: "before" },
            { pattern: "@/hooks/**", group: "internal", position: "before" },
            { pattern: "@/lib/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "external"],
          "newlines-between": "never",
        },
      ],
    },
  },

  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}", "src/hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: ["@/api/repositories/*", "**/api/repositories/*", "**/repositories/*"],
          message: "app/components/hooks must call api/services, not api/repositories." },
        { group: ["@/api/apiClient", "**/api/apiClient", "**/apiClient"],
          message: "Only api/repositories may use apiClient." },
      ] }],
    },
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: ["@/api/*", "**/api/*", "@/app/*", "**/app/*"],
          message: "components/ui must stay generic: no API or route imports." },
      ] }],
    },
  },
  {
    files: ["src/api/repositories/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: ["@/api/services/*", "**/services/*"],
          message: "repositories must not import services." },
      ] }],
    },
  },
  {
    files: ["src/api/services/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: ["@/api/apiClient", "**/api/apiClient", "**/apiClient"],
          message: "services must go through repositories, not apiClient." },
      ] }],
    },
  },

  prettier,
]);
