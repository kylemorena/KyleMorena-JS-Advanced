const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: {
    app:'./src/js/app.js',
    loadApi: './src/js/loadApi.js',
    mapTile: './src/js/mapTile.js',
    widget: './src/js/outputHtml.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization:{
    minimizer: [new OptimizeCssAssetsPlugin()]
  },
  devtool: 'inline-source-map',
  devServer:{
    open:true,
    contentBase: './dist',
    hot: true,
    port:8000
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), 
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      favicon:'./src/img/svg/KM_logo.svg',
      chunks:['app']
    }), // aggiunge i tag <script> nel file oltre a crearlo automaticamente index.html in automatico
    new CleanWebpackPlugin(),//cancella in automatica quello che non ci serve
    new MiniCssExtractPlugin({filename:'[name].css'}),
    new Dotenv({path:'./.env'}) //creo la varibile ambiente
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader','sass-loader'],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader:'html-loader',
            options: {minimize:true}
          }
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use:[{
          loader:'file-loader',
          options: {
            name:'[name].[ext]',
            outputPath: 'img/',
            publicPath: 'img/',
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              "@babel/transform-runtime",
              "@babel/proposal-class-properties"
            ]
          }
        }
      }
    ],
  },
};