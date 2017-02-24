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
  entry:[
    // 'webpack-dev-server/client?http://0.0.0.0:8080',
    // 'webpack/hot/dev-server',
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
        // include: path.resolve(__dirname,'client'),
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /(\.css|\.scss)$/,
        // loader: ExtractTextPlugin.extract('style-loader', extract_loaders)
        loader: ExtractTextPlugin.extract({fallback: 'style-loader',loader: extract_loaders})
        //css modules are such a pain when rendering from server. hence not using them
      },
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'file-loader'
      }
    ]
  },
  // postcss: function(){
  //   return [autoprefixer];
  // },
  resolve:{
    extensions:['.js', '.jsx']
  },
  plugins:[
    // new ExtractTextPlugin('style.css',{allChunks:true}),
    new ExtractTextPlugin({filename: 'style.css', allChunks: true}),
    new CopyWebpackPlugin([
      {from: 'client/images' ,to: 'public/images'}
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({ options: { postcss: [ autoprefixer ] } })
  ],
  // devServer:{
  //   hot: true,
  //   proxy: {
  //     '**': 'http://web:8000'
  //   },
  //   contentBase: __dirname + '/public',
  // }
}
