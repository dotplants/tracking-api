module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['@yuzulabo', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module'
  },
  env: { node: true, es6: true }
};
