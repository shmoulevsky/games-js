import Game from '../../src/base/game';
import GameHelper from '../../src/base/gameHelper';
import MainScreen from './mainScreen';
import StartScreen from './startScreen';
import ResultScreen from './resultScreen';

window.onload = function() {
	
    let helper = new GameHelper();    
    let game = new Game(800, 600, '#game-canvas', helper);	
    
    game.settings['game_path']['img'] = './assets/';
    game.settings['game_path']['snd'] = '';
    game.settings['scaleImg'] = 0.5;
    game.settings['countImg'] = 10;          
    game.settings['minutes'] = 5;

    let startScreen = new StartScreen('start/start-bg.svg', game);	
	startScreen.isShow = true;

    let mainScreen = new MainScreen('bg/bg-1.svg', game);
    mainScreen.isShow = false;

    let resultScreen = new ResultScreen('win/win-bg.svg', game);	
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
 game.draw();	
    


};