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
  entry: './src/game-3/main.js',
  output: {
    path: path.resolve(__dirname, 'public'), 
    filename: 'js/games/2/bundle.js' 
  },
  watch: true
};
