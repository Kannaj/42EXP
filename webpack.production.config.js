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
        loader: 'babel',
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /(\.css|\.scss)$/,
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
    extensions:['', '.js', '.jsx']
  },
  plugins:[
      new ExtractTextPlugin({filename: 'style.css', allChunks: true}),
    // new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CopyWebpackPlugin([
      {from: 'client/images' ,to: 'public/images'}
    ]),
    new webpack.LoaderOptionsPlugin({ options: { postcss: [ autoprefixer ] } })
  ]
}
