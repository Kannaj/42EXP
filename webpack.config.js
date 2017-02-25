var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var extract_loaders = [
  {
    loader: 'css-loader',
  },
  {
    loader: 'postcss-loader'
  },
  {
    loader: 'sass-loader'
  }
]

module.exports = {
  devtool: "source-map",
  entry:[
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client?http://0.0.0.0:8080&reload=true',
    './client/index.js'
  ],
  output:{
    path:__dirname + '/public',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module:{
    rules:[
      {
        test:/(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        use: [
          {

            loader: 'react-hot-loader'
          },
          {
            loader: 'babel-loader',
          }
        ]
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /(\.css|\.scss)$/,
        loader: ExtractTextPlugin.extract({fallback: 'style-loader',loader: extract_loaders})
      },
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'file-loader'
      }
    ]
  },
  resolve:{
    extensions:['.js', '.jsx']
  },
  plugins:[
    new ExtractTextPlugin({filename: 'style.css', allChunks: true}),
    new CopyWebpackPlugin([
      {from: 'client/images' ,to: 'public/images'}
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({ options: { postcss: [ autoprefixer ] } })
  ]
}
