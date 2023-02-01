import Game from '../../src/base/Game';
import GameHelper from '../../src/base/Utils/GameHelper';
import MainScreen from './Screens/MainScreen';
import UIManager from "../base/UI/UIManager";

let _ = require('lodash');

let pathImg = '/storage/assets/';
let pathSnd = '/storage/assets/snd/';

let helper = new GameHelper();
let uiManager = new UIManager(pathImg, pathSnd);
let game = new Game(800, 600, '#game-canvas', helper, uiManager);

game.settings['path']['img'] = pathImg;
game.settings['path']['snd'] = pathSnd;

game.settings['scaleImg'] = 0.5;
game.settings['countImg'] = 10;
game.settings['minutes'] = 5;

let mainScreen = new MainScreen('', game);


mainScreen.isShow = true;
mainScreen.initScene();
game.screens.push(mainScreen);


// включаем перетаскивание
game.initDrag();

window.onkeydown = function(e) {

};

document.querySelector('#game-canvas').style.display = 'block';
document.querySelector('#card-canvas').style.display = 'none';
game.draw();