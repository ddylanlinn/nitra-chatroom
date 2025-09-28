export default {
  // Indentation settings matching .editorconfig
  tabWidth: 2,
  useTabs: false,

  // Line ending settings matching .editorconfig
  endOfLine: 'lf',

  // General formatting preferences
  printWidth: 100,
  singleQuote: true,
  semi: false,
  trailingComma: 'all',

  // Vue specific settings
  vueIndentScriptAndStyle: false,

  // File type overrides
  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue',
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'preserve',
      },
    },
  ],
}
