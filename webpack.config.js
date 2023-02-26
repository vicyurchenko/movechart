const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'chartjs-plugin-move-chart.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MoveChart',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  externals: {
    'chart.js': {
      commonjs: 'chart.js',
      commonjs2: 'chart.js',
      amd: 'chart.js',
      root: 'Chart',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
