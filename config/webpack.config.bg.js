const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, '../src'),
  entry: './background.js',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'background.js'
  },
  module: {
    rules: [{
      test: /^background\.js$/,
      include: path.resolve(__dirname, '../src'),
      use: [{
        loader: 'babel-loader'
      }]
    }]
  }
}

module.exports = config
