import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "off"
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "off"
    }
  }
]

