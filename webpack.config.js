const path = require('path')

module.exports = {
  entry: './src/web.ts',
  devServer: {
    contentBase: path.resolve(__dirname, 'web/')
  },
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'web')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
