export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "off"
    }
  }
]

