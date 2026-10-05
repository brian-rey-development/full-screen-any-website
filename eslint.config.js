import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      "max-lines-per-function": ["error", { max: 20, skipBlankLines: true, skipComments: true }],
      "no-magic-numbers": ["error", { ignore: [0, 1, -1], ignoreArrayIndexes: true }],
    },
  },
  {
    files: ["**/*.test.ts", "src/testing/**"],
    rules: { "max-lines-per-function": "off", "no-magic-numbers": "off" },
  },
  { files: ["eslint.config.js"], extends: [tseslint.configs.disableTypeChecked] },
  prettier,
);
