module.exports = {
  type: 'preact',
  build: {
    addModernJS: true
  },
  webpack: config => {
    // Stop `import()`-ed chunks from being split into `[name].js` and `vendors~[name].js`
    config.optimization = config.optimization || {};
    config.optimization.splitChunks = {
      cacheGroups: {
        vendors: false
      }
    };

    return config;
  }
};
