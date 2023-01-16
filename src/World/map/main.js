import Game from '../../../src/base/Game';
import GameHelper from '../../../src/base/Utils/GameHelper';
import MainScreen from './Screens/MainScreen';
import UIManager from "../../base/UI/UIManager";
import StartScreen from "../../base/Screens/StartScreen";
import ResultScreen from "../../base/Screens/ResultScreen";
import DefaultSettings from "../../base/Settings/DefaultSettings";



    let helper = new GameHelper();
    let settings = new DefaultSettings();
    let uiManager = new UIManager(settings.path.img, settings.path.snd);
    let game = new Game(800, 600, '#game-canvas', helper, uiManager);
    game.settings = settings;

    let startScreen = new StartScreen('/start/start-bg.svg', game);
	startScreen.isShow = true;

    let mainScreen = new MainScreen('/world/map.svg', game);
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

 document.querySelector('#game-canvas').style.display = 'block';
 document.querySelector('#card-canvas').style.display = 'none';
 game.draw();