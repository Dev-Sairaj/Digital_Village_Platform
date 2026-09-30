import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "coverage"]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    plugins: {
      "react-hooks": reactHooks,
      import: importPlugin,
    },
    rules: {
      // React hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // TypeScript: no `any` (allow only at typed I/O boundaries with a disable comment + reason)
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],

      // Import order: external -> @/api -> @/components -> @/hooks -> @/lib -> relative
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            { pattern: "@/api/**", group: "internal", position: "before" },
            {
              pattern: "@/components/**",
              group: "internal",
              position: "before",
            },
            { pattern: "@/hooks/**", group: "internal", position: "before" },
            { pattern: "@/lib/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "external"],
          "newlines-between": "never",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Architecture layering: pages/components -> services -> repositories -> apiClient
  // ---------------------------------------------------------------------------

  // pages / components / hooks: may not touch repositories or apiClient directly
  {
    files: [
      "src/pages/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
      "src/hooks/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/api/repositories/*",
                "**/api/repositories/*",
                "**/repositories/*",
              ],
              message:
                "pages/components/hooks must call api/services, not api/repositories.",
            },
            {
              group: ["@/api/apiClient", "**/api/apiClient", "**/apiClient"],
              message: "Only api/repositories may use apiClient.",
            },
          ],
        },
      ],
    },
  },

  // components/ui: dumb primitives, no API imports at all
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/api/*", "**/api/*", "@/pages/*", "**/pages/*"],
              message:
                "components/ui must stay generic: no API or page imports.",
            },
          ],
        },
      ],
    },
  },

  // repositories: raw API calls only, must not import services
  {
    files: ["src/api/repositories/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/api/services/*", "**/services/*"],
              message: "repositories must not import services.",
            },
          ],
        },
      ],
    },
  },

  // services: call repositories, never apiClient directly
  {
    files: ["src/api/services/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/api/apiClient", "**/api/apiClient", "**/apiClient"],
              message: "services must go through repositories, not apiClient.",
            },
          ],
        },
      ],
    },
  },

  // Must be last: turns off rules that clash with Prettier
  prettier,
]);
