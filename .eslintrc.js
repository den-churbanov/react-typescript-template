module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "import/prefer-default-export": "off",
    'max-len': ['error', {code: 300}],
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'object-curly-newline': ['error', {
      minProperties: Infinity,
      multiline: true,
      consistent: true,
    }],
    'linebreak-style': 'off',
    'spaced-comment': ['error', 'always', {
      markers: ['#region', '#endregion'],
    }],
    "indent": 'off',
    "import/no-cycle": 'off',
  },
  overrides: [
    {
      files: [
        '**/src/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
