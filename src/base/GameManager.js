import GameHelper from "./Utils/GameHelper";
import UIManager from "./UI/UIManager";
import Game from "./Game";
import StartScreen from "./Screens/StartScreen";
import SettingsScreen from "./Screens/SettingsScreen";
import ResultScreen from "./Screens/ResultScreen";
import MainScreenFactory from "./MainScreenFactory";
import settingsScreens from "lodash/_SetCache";

export default class GameManager{

    init(options, settings, bg, startBg, settingsBg, winBg, hero, code){

        let helper = new GameHelper();
        let uiManager = new UIManager(settings.path.img, settings.path.snd, settings);
        let game = new Game(settings.width, settings.height, '#game-canvas', helper, uiManager);

        game.settings = settings;

        let settingsScreen = null
        let startScreen = new StartScreen(bg, game, hero);


        let mainScreenFactory = new MainScreenFactory();
        let mainScreen = mainScreenFactory.make(code, bg, game, hero);
        mainScreen.isShow = false;

        let settingsScreens = [];

        if (options){
            for (let key in options) {
                settingsScreen = new SettingsScreen(bg, game, hero, 'Настройки', options[key], parseInt(key)+2);
                settingsScreen.isShow = false;
                settingsScreens.push(settingsScreen);
            }
        }

        startScreen.isShow = true;

        let resultScreen = new ResultScreen(winBg, game, hero);
        resultScreen.isShow = false;

        // расстановка и создание объектов сцены
        startScreen.initScene();
        resultScreen.initScene();

        game.screens.push(startScreen);

        if (options){
            for (let key in settingsScreens) {
                game.screens.push(settingsScreens[key]);
            }
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