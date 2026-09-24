// GitHub Pages serves the web demo from /<repository-name>/, so the web
// build needs that prefix on every URL. The CI workflow sets EXPO_BASE_URL;
// local development runs from the site root as usual.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.EXPO_BASE_URL ? { baseUrl: process.env.EXPO_BASE_URL } : {}),
  },
});
