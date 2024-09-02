module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        version: '>=13.0.0',
        ignores: ['modules'],
      },
    ],
    'import/no-import-module-exports': 'off',
  },
};
