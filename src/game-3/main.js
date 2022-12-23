import Game from '../../src/base/Game';
import GameHelper from '../../src/base/Utils/GameHelper';
import MainScreen from './Screens/MainScreen';
import StartScreen from './Screens/StartScreen';
import ResultScreen from './Screens/ResultScreen';
import UIManager from "../base/UI/UIManager";


    let pathImg = '/storage/assets/';
    let pathSnd = '/storage/assets/snd/';

    let helper = new GameHelper();
    let uiManager = new UIManager(pathImg, pathSnd);
    let game = new Game(800, 600, '#game-canvas', helper, uiManager);

    game.settings['path']['img'] = pathImg;
    game.settings['path']['snd'] = pathSnd;

    game.settings['scaleImg'] = 0.5;
    game.settings['countImg'] = 10;
    game.settings['minutes'] = 2;

    let startScreen = new StartScreen('/start/start-bg.svg', game);
	startScreen.isShow = true;

    let mainScreen = new MainScreen('', game);
    mainScreen.isShow = false;

    let resultScreen = new ResultScreen('/win/win-bg.svg', game);
	resultScreen.isShow = false;

    // расстановка и создание объектов сцены
    startScreen.initScene();
    mainScreen.initScene();
    resultScreen.initScene();


    game.screens.push(startScreen);
    game.screens.push(mainScreen);
    game.screens.push(resultScreen);

    // включаем перетаскивание
    game.initDrag();

    window.onkeydown = function(e) {

    };
 
 document.querySelector('#game-canvas').style.display = 'block';
 document.querySelector('#card-canvas').style.display = 'none';
 game.draw();