const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'chartjs-plugin-move-chart.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'moveChart',
    libraryExport: 'default',
    libraryTarget: 'umd', // формат сборки для использования в разных средах (CommonJS, AMD, Browser Global)
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  externals: {
    chartjs: {
      commonjs: 'chart.js',
      commonjs2: 'chart.js',
      amd: 'chart.js',
      root: 'Chart',
    },
  },
};
