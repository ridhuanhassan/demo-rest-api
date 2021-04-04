module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'func-names': 'off',
    'no-underscore-dangle': 'off',
    'no-useless-return': 'off',
    'no-continue': 'off',
    'prefer-destructuring': 'off',
    'no-cond-assign': 'off',
  },
  overrides: [{
    files: ['tests/libs/*/*.js'],
    rules: {
      'no-undef': 'off',
    },
  }, {
    files: ['./index.js'],
    rules: {
      'max-len': [
        'error', {
          code: 101,
        },
      ],
    },
  }, {
    files: ['routers/*.js'],
    rules: {
      'global-require': 'off',
    },
  }],
};
