const path = require('path');
//const outputPath = '/js/games/';
const outputPath = '/home/eugeny/Projects/sites/games/storage/app/public/js/games';
let outputList = [];

let games = [
  'Primery/plus',
  'Primery/multy',
  'Primery/color',
  'Denesh/find',
  'Denesh/findAll',
  'QuickSort/figurs',
  'Shulte/simple',
  'Shulte/digits',
  'Memory/simple',
  'Sort/figurs',
  'Sort/digits',
  'Series/find',
  'Series/digits',
  'Count/simple',
  'FindAll/letters',
  'Memory/pair',
  'Turtle/simple',
  'Turtle/map',
  'World/map'
];

let pathIn = '';
let pathOut = '';
let ob = {};

for(let key in games){
  pathIn = './src/'+games[key]+'/main.js';
  pathOut = '/js/games/'+games[key].toLowerCase()+'/bundle';
  ob[pathOut] = pathIn;
  outputList.push(ob);
  ob = {};
}

console.log(outputList);

module.exports = {
  mode: "development", // could be "production" as well
  "scripts": {
   "test": "echo \"Error: no test specified\" && exit 1",
   "watch": "webpack --watch",
   "build": "webpack"
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
  entry: outputList,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  watch: true
};