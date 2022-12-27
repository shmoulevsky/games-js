const path = require('path');

module.exports = {
  mode: "development", // could be "production" as well
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9500,
    //allowedHosts: ['game.com'],
    proxy: {
      '/api' : 'http://127.100.100.150'
    },
  },
  entry: {
    'js/games/primery/plus/bundle' : './src/Primery/plus/main.js',
    'js/games/primery/multy/bundle' : './src/Primery/multy/main.js',
    'js/games/denesh/find/bundle' : './src/Denesh/find/main.js',
    'js/games/denesh/findAll/bundle' : './src/Denesh/findAll/main.js',
    'js/games/quicksort/figurs/bundle' : './src/QuickSort/figurs/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  watch: true
};
