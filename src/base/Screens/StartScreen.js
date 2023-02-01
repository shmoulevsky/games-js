import GameScreen from './GameScreen'
import BaseSprite from '../Images/BaseSprite'
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

        let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','win',0,0,this.width,this.height,' ');

        let btn = new BaseSprite(this.game.settings.path.img + 'start/start-btn.svg','start-btn','win',550,190,193,72,' ');
		let arrow = new BaseSprite(this.game.settings.path.img + 'win/arrow.svg','arrow','win',535,250,90,91,' ');
	    this.items.push(bg);
	    this.items.push(btn);
	    this.items.push(arrow);
	        
	    this.tweens['tweenArrowWin'] = gsap.to(arrow, {_y : "280", duration : 1, repeat: -1, yoyo:true});
        
    }

    checkMouseMove(e){

    }


    checkMouseClick(e){
		
        if(typeof(e) == 'undefined') return;
        
        for(let i=0;i<this.items.length;i++){
                        
            if(this.items[i].name === 'start-btn' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){

                    setTimeout(() => {
                        this.game.showScreen(0,1);
                    }, 10);

                    e.preventDefault();
                    return;
            }
        }
       
    }

    
    // цикл отрисовки
    render(){
			
        
    }

}