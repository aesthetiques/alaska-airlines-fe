'use strict'

require('dotenv').config({ path: `${__dirname}/.dev.env`})
const production = process.env.NODE_ENV === 'production'

const {DefinePlugin, EnvironmentPlugin} = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const UglifyPlugin = require('uglifyjs-webpack-plugin')

const plugins = [
  new EnvironmentPlugin(['NODE_ENV']),
  new ExtractTextPlugin('bundle-[hash].css'),
  new HTMLPlugin({ template: `${__dirname}/src/index.html`}),
  new DefinePlugin({
    __DEBUG__: JSON.stringify(!production),
    __API_URL__: JSON.stringify(process.env.API_URL,)
  })
]

if(production){
  plugins = plugins.concat([
    new CleanPlugin(),
    new UglifyPlugin()
  ])
}

module.exports = {
  plugins,
  devtool: production ? undefined : 'source-map',
  devServer: {historyApiFallback: true},
  entry: `${__dirname}/src/main.js`,
  output: {
    path: `${__dirname}/build/`,
    filename: 'bundle-[hash].js',
    publicPath: process.env.CDN_URL,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
      },
      {
        test: /\.(woff|woff2|ttf|eot|glyph\.svg)$/,
        use: [
           {
             loader: 'url-loader',
             options: {
               limit: 10000,
               name: 'font/[name].[ext]'
             },
           },
        ],
      },
      {
        test: /\.(jpg|jpeg|gif|png|tiff|svg)$/,
        exclude: /glyph\.svg/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 60000,
              name: 'image/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(mp3|aac\aiff|wav|flac|m4a|mp4|ogg)$/,
        exclude: /glyph\.svg/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'audio/[name].[ext]',
            },
          },
        ],
      },

    ]
  },
}