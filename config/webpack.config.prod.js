const path = require('path');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV || 'production';
const BUNDLE_PREFIX = process.env.BUNDLE_PREFIX
  ? `.${process.env.BUNDLE_PREFIX}`
  : '';
const nodeModulesPrefix = path.resolve(__dirname, 'node_modules') + '/';
const publicPath = paths.servedPath;

module.exports = {
  entry: './src/index.js',
  target: 'web',
  output: {
    // The build folder.
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  mode: NODE_ENV,
  optimization: {
    splitChunks: {
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          filename: `vendor.bundle${BUNDLE_PREFIX}.js`,
          chunks: 'all',
          enforce: true,
          test({ resource }) {
            return resource && resource.startsWith(nodeModulesPrefix);
          },
        },
      },
    },
  },
  resolve: {
    symlinks: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      filename: 'popup.html',
    }),
  ],
};
