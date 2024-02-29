const path = require('path');
const webpack = require('webpack');

module.exports = {
  css: {
    extract: false
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })],
  },
  productionSourceMap: false
};
