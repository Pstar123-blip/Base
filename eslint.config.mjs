import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import sort from 'eslint-plugin-simple-import-sort';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.turbo/**',
      'client/src/api/generated/**',
      '**/drizzle/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'simple-import-sort': sort, '@stylistic': stylistic },
    rules: {
      curly: ['error', 'all'],
      '@stylistic/lines-between-class-members': ['error', 'always'],
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['block-like', 'type', 'interface'],
        },
        {
          blankLine: 'always',
          prev: ['block-like', 'type', 'interface'],
          next: '*',
        },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
  {
    files: ['api/**/*.ts'],
    rules: { '@typescript-eslint/consistent-type-imports': 'off' },
  },
  prettierRecommended,
);
