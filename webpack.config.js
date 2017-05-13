var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './js/main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader",
        }]
      },
      {
        test: /\.woff2?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: './css/fonts/[hash].[ext]',
            limit: 50000,
            mimetype: 'application/font-woff',
          },
        }
      },
      {
        test: /\.woff?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: './css/fonts/[hash].[ext]',
            limit: 50000,
            mimetype: 'application/font-woff',
          },
        }
      },
    ]
  },
  resolve: {
    modules: [
      path.resolve('./js'),
      path.resolve('./'),
      'node_modules'
    ]
  },
};
