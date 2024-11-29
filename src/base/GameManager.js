import GameHelper from "./Utils/GameHelper";
import UIManager from "./UI/UIManager";
import Game from "./Game";
import StartScreen from "./Screens/StartScreen";
import SettingsScreen from "./Screens/SettingsScreen";
import ResultScreen from "./Screens/ResultScreen";
import MainScreenFactory from "./MainScreenFactory";

export default class GameManager{

    init(options, settings, bg, startBg, settingsBg, winBg, hero, code){

        let helper = new GameHelper();
        let uiManager = new UIManager(settings.path.img, settings.path.snd, settings);
        let game = new Game(settings.width, settings.height, '#game-canvas', helper, uiManager);

        game.settings = settings;

        let settingsScreen = null
        let startScreen = new StartScreen(startBg, game);

        let mainScreenFactory = new MainScreenFactory();
        let mainScreen = mainScreenFactory.make(code, bg, game, hero);
        mainScreen.isShow = false;

        if (options){
            settingsScreen = new SettingsScreen(settingsBg, game, 'Настройки', options);
            settingsScreen.isShow = false;
        }

        startScreen.isShow = true;

        let resultScreen = new ResultScreen(winBg, game);
        resultScreen.isShow = false;

        // расстановка и создание объектов сцены
        startScreen.initScene();
        resultScreen.initScene();


        game.screens.push(startScreen);

        if (options){
            game.screens.push(settingsScreen);
        }

        game.screens.push(mainScreen);
        game.screens.push(resultScreen);

        // включаем перетаскивание
        game.initDrag();

        document.querySelector('#game-canvas').style.display = 'block';
        document.querySelector('#card-canvas').style.display = 'none';
        game.draw();

    }

}