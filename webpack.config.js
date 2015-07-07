const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        loader: 'babel'
      },
      { test: /\.html$/, loader: 'mustache' },
      { test: /\.scss$/, loader: 'style!css!sass?sourceMap' },
      { test: /\.png$/, loader: 'url-loader?limit=100000' }
    ]
  },
  devServer: {
    contentBase: "./dist",
    https: true
  }
};
