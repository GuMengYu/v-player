module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    '@antfu',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  // 'parser': '@typescript-eslint/parser',
  // 'parserOptions': {
  //     'ecmaVersion': 'latest',
  //     'sourceType': 'module'
  // },
  // 'plugins': [
  //     '@typescript-eslint',
  //     'react'
  // ],
  rules: {
    // 'indent': [
    //   'warn',
    //   2,
    // ],
    // 'linebreak-style': [
    //   'error',
    //   'unix',
    // ],
    // 'quotes': [
    //   'error',
    //   'single',
    // ],
    // 'semi': [
    //   'error',
    //   'always',
    // ],
    'n/prefer-global/process': 0,
    'no-console': 0,
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'jsdoc/require-returns-description': 0,
    'unused-imports/no-unused-vars': 0,
    'jsdoc/check-param-names': 0,
    '@typescript-eslint/consistent-type-imports': 0,
    'n/prefer-global/buffer': 0,
  },
  ignorePatterns: ['pipLyric.ts', '.vscode', 'dist-electron', 'dist'],
  // ignorePatterns: ['dist','dist-electron', 'release', 'public', '!.eslintrc.js', '!.prettierrc.js'],
}
