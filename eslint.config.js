// @ts-check

import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked, eslintPluginPrettierRecommended],
  files: ['**/*.ts'],
  languageOptions: {
    globals: globals.browser,
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    'prettier/prettier': 'warn',
  },
});
