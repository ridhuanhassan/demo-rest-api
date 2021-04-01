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
  },
};
