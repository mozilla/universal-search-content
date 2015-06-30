const HtmlWebpackPlugin = require('html-webpack-plugin');
const AppCachePlugin = require('appcache-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  plugins: [
    new AppCachePlugin(),
    new HtmlWebpackPlugin({
      hash: false,
      title: 'Universal Search'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      { test: /\.html$/, loader: 'mustache' },
      { test: /\.scss$/, loader: 'style!css!sass?sourceMap' },
      { test: /\.png$/, loader: 'url-loader?limit=100000' }
    ]
  }
};
