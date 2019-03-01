const path = require('path');

module.exports = {
  entry: './example/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      'spine-ts': path.resolve('spine-runtimes/spine-ts/build/spine-core')
    }
  },
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'bin')
  },
  externals: {
    'spine-ts': 'spine-ts'
  }
};