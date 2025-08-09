const path = require('path');

const gamesData = require('./public/games.json'); // предполагаем, что JSON находится в файле games.json

// Создаем объект entry динамически на основе данных из JSON
const createEntryPoints = () => {
    const entries = {};

    gamesData.forEach(game => {
        entries[`js/games/${game.code}/bundle`] = `./src/games/${game.code}/main.js`;
    });

    return entries;
};

module.exports = {
  mode: "development",
  //mode: "production",
  performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
  },
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
  entry: createEntryPoints(),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  watch: true,
};
