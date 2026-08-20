import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pathAlias from 'eslint-plugin-path-alias';
import { resolve } from 'node:path';

export default tseslint.config(
  js.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    ignores: ['dist/*', 'vite.config.ts'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.app.json',
      },
    },
    plugins: {
      'path-alias': pathAlias,
    },
    rules: {
      'path-alias/no-relative': ['off', {
        paths: {
          '@': resolve(import.meta.dirname, './src'),
        },
      }],

      // TypeScript strict rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Code style
      'prefer-const': 'warn',
      'no-var': 'error',
      'object-shorthand': 'error',
      'quote-props': ['error', 'as-needed'],
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['warn', 'as-needed'],
      'no-duplicate-imports': 'warn',

      // Formatting
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'comma-dangle': ['warn', 'always-multiline'],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'max-len': ['warn', { code: 100, ignoreUrls: true, ignoreStrings: true }],
    },
  },
)
