import GameScreen from './../../base/Screens/GameScreen'
import BaseSprite from './../../base/Images/BaseSprite'
import gsap from "gsap";

// основной класс игры
export default class MainScreen extends GameScreen{
		
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

        let bg = new BaseSprite( this.game.settings['path']['img'] + this.bg,'bg','win',0,0,this.width,this.height,' ');
        
        let hero_win = new BaseSprite(this.game.settings['path']['img'] + 'win/sova-2.svg','hero-1','win',550,360,240,210,' ');
		let win_text = new BaseSprite(this.game.settings['path']['img'] + 'win/molodec.svg','ok-text','win',120,50,588,82,' ');

        let repeat_btn = new BaseSprite(this.game.settings['path']['img'] + 'win/repeat-btn.svg','repeat-btn','win',550,190,193,72,' ');
		let arrow = new BaseSprite(this.game.settings['path']['img'] + 'win/arrow.svg','arrow','win',535,250,90,91,' ');
			
	    this.items.push(bg);
	    this.items.push(hero_win);
	    this.items.push(win_text);
	    this.items.push(repeat_btn);
	    this.items.push(arrow);
	        
	    this.tweens['tweenArrowWin'] = gsap.to(arrow, {_y : "280", duration : 1 , repeat: -1, yoyo:true});
        
    }

    checkMouseClick(e){
		
        if(typeof(e) == 'undefined') return;
        
        for(var i=0;i<this.items.length;i++){
                        
            if(this.items[i].name == 'repeat-btn' && 
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){

                    this.game.reset();
					this.game.screens[1].initScene();
					this.game.screens[1].setTimer();
					this.game.showScreen(2,1);
            }
        }
       
    }

    
    // цикл отрисовки
    render(){
			
        this.game.ctx.fillStyle = "#fff";
		this.game.ctx.font = "24pt Arial";
			    
		this.game.ctx.fillText(this.game.uiManager.right , 228, 380);
		this.game.ctx.fillText(this.game.uiManager.wrong , 375, 380);
		this.game.ctx.fillStyle = "#fff";
		this.game.ctx.font = "36pt Arial";
		this.game.ctx.fillText(this.game.uiManager.points , 274, 290);
			    
		this.game.ctx.fillStyle = "#000";
		this.game.ctx.font = "24pt Arial";
		this.game.ctx.fillText('Время: '+ this.game.minutes+ ':' + this.game.seconds , 100, 480);
        
        
        
    }

}