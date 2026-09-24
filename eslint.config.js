// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'android/*', 'node_modules/*'],
  },
  {
    files: ['**/__tests__/**/*.js'],
    languageOptions: { globals: { jest: 'readonly', describe: 'readonly', test: 'readonly', expect: 'readonly' } },
  },
]);
