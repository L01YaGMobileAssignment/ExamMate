module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
    browser: true,
    "react-native/react-native": true,
  },
  plugins: ["@typescript-eslint", "react", "react-native", "prettier"],
  extends: ["eslint:recommended", "@react-native-community", "prettier"],
  rules: {
    // Prettier handles formatting
    "prettier/prettier": "error",

    // React rules
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",

    // TypeScript rules - only warnings for flexibility
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",

    // Turn off annoying rules
    "no-console": "off",
    "react-native/no-inline-styles": "off",
    "react-native/no-color-literals": "off",
    "react-native/sort-styles": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
