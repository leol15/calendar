
// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  prettierConfig
);

/*
Const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

eslintConfig.push({
  plugins: {
    'jsx-a11y': eslintPlugin,
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/alt-text': 'error',
    'no-unused-vars': 'warn',
    eqeqeq: 'error',
    curly: 'error',
    quotes: ['error', 'single'],
    'no-trailing-spaces': 'error',
  },
});

export default eslintConfig;
*/