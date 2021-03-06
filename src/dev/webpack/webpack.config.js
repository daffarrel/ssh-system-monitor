const path    = require('path');
const webpack = require('webpack');

import loaders from './loaders.config'
import plugins from './plugins.config'

module.exports = {
  devtool: 'source-map',
  entry:   [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    path.resolve(path.join(__dirname, '../../app/index')),
  ],
  output:  {
    path:       path.join(__dirname, '../dist'),
    filename:   'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    ...plugins
  ],
  module:  {
    loaders: loaders,
  },
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules',
    ],
    extensions:         [
      '',
      '.js',
      '.json',
      '.jsx',
    ],
  },
};
