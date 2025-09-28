import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Vue essential rules
  ...pluginVue.configs['flat/essential'],

  // Global ignores
  {
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/*.d.ts',
      'node_modules/',
      '.quasar/',
      'src/generated/',
      '*.min.js',
      '*.min.css',
    ],
  },

  // JavaScript files configuration
  {
    files: ['**/*.{js,mjs,jsx}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      // Indentation rules matching .editorconfig
      'indent': ['error', 2, { 'SwitchCase': 1 }],

      // Line ending rules matching .editorconfig
      'linebreak-style': ['error', 'unix'],

      // General code quality rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': 'warn',

      // Spacing and formatting
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
    },
  },

  // TypeScript files configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Disable base rule and use TypeScript version
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',

      // Indentation rules matching .editorconfig
      'indent': 'off',
      '@typescript-eslint/indent': ['error', 2, { 'SwitchCase': 1 }],

      // Line ending rules matching .editorconfig
      'linebreak-style': ['error', 'unix'],

      // General code quality rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // Spacing and formatting
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      '@typescript-eslint/quotes': ['error', 'single'],
      '@typescript-eslint/semi': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
    },
  },

  // Vue files configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      // Vue specific rules
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/require-v-for-key': 'error',
      'vue/html-indent': ['error', 2],
    },
  },
]
