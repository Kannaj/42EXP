ar webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
  ]
}
