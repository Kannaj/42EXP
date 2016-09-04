var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry:[
    './client/index.js'
  ],
  output:{
    path:__dirname + '/public',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module:{
    loaders:[
      {
        test:/(\.js|\.jsx)$/,
        // include: path.resolve(__dirname,'client'),
        exclude: /(node_modules)/,
        loader: 'babel',
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /(\.css|\.scss)$/,
        loader: ExtractTextPlugin.extract('style',['css','postcss','sass'])
        //css modules are such a pain when rendering from server. hence not using them
      },
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'file-loader'
      }
    ]
  },
  postcss: function(){
    return [autoprefixer];
  },
  resolve:{
    extensions:['', '.js', '.jsx']
  },
  plugins:[
    new ExtractTextPlugin('style.css',{allChunks:true}),
    new CopyWebpackPlugin([
      {from: 'client/images' to: 'public/images'}
    ])
  ]
}
