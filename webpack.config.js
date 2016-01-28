const HtmlWebpackPlugin = require('html-webpack-plugin');
const normalize = require('node-normalize-scss');

module.exports = {
  entry: './src/main.js',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Universal Search'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.html$/, loader: 'mustache' },
      { test: /\.scss$/, loader: 'style!css!sass?sourceMap&includePaths[]=' + normalize.includePaths }
    ]
  },
  devServer: {
    contentBase: './dist',
    https: true
  }
};
