const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, '../src'),
  entry: {
    background: './background.js',
    content: './content.js',
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: /^(background|content)\.js$/,
      include: path.resolve(__dirname, '../src'),
      use: [{
        loader: 'babel-loader'
      }]
    }]
  }
}

module.exports = config
