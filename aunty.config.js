const path = require('path');

module.exports = {
  type: 'preact',
  webpack: config => {
    // Stop `import()`-ed chunks from being split into `[name].js` and `vendors~[name].js`
    config.optimization.splitChunks = {
      cacheGroups: {
        vendors: false
      }
    };

    // Update aliases to use preact@10
    config.resolve.alias.react = 'preact/compat';
    config.resolve.alias['react-dom'] = 'preact/compat';
    delete config.resolve.alias['create-react-class'];

    return config;
  }
};
