import GameScreen from './../../base/Screens/GameScreen'
import BaseSprite from './../../base/Images/BaseSprite'
import gsap from "gsap";

// основной класс игры
export default class StartScreen extends GameScreen{
		
    constructor(bgImg, game, width = 800, height = 600){
        super();
        
        this.basket = [];
        this.width = width;
        this.height = height;
        this.game = game;
        this.bg = bgImg;
                      
        
    }

    initScene(){

        this.items = [];

        let bg = new BaseSprite( this.game.settings['game_path']['img'] + this.bg,'bg','win',0,0,this.width,this.height,' ');
        
        //let hero = new BaseSprite(this.game.settings['game_path']['img'] + 'win/sova-2.svg','hero-1','win',550,360,240,210,' ');
		//let text = new BaseSprite(this.game.settings['game_path']['img'] + 'win/molodec.svg','ok-text','win',120,50,588,82,' ');

        let btn = new BaseSprite(this.game.settings['game_path']['img'] + 'start/start-btn.svg','start-btn','win',550,190,193,72,' ');
		let arrow = new BaseSprite(this.game.settings['game_path']['img'] + 'win/arrow.svg','arrow','win',535,250,90,91,' ');
			
	    this.items.push(bg);
	    //this.items.push(hero);
	    //this.items.push(text);
	    this.items.push(btn);
	    this.items.push(arrow);
	        
	    this.tweens['tweenArrowWin'] = gsap.to(arrow, {_y : "280", duration : 1, repeat: -1, yoyo:true});
        
    }

    checkMouseClick(e){
		
        if(typeof(e) == 'undefined') return;
        
        for(var i=0;i<this.items.length;i++){
                        
            if(this.items[i].name == 'start-btn' && 
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
                    this.game.showScreen(0,1);
                    e.preventDefault();
                    return;
            }
        }
       
    }

    
    // цикл отрисовки
    render(){
			
        
    }

}