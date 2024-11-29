import GameScreen from './GameScreen'
import BaseSprite from '../Images/BaseSprite'
import gsap from "gsap";

// основной класс игры
export default class MainScreen extends GameScreen{
		
    constructor(bgImg, game){
        super();
        
        this.basket = [];
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.game = game;
        this.bg = bgImg;
                      
        
    }

    initScene(){

        let repeatBtnY = 200;
        let repeatBtnX = 550;
        this.items = [];

        let bg = new BaseSprite( this.game.settings['path']['img'] + this.bg,'bg','win',0,0,this.width,this.height,' ');
        
        let hero_win = new BaseSprite(this.game.settings['path']['img'] + 'hero/owl.svg','hero-1','win',this.width - 400,this.height - 400,400,400,' ');
		let win_text = new BaseSprite(this.game.settings['path']['img'] + 'win/molodec.svg','ok-text','win',120,70,588,82,' ');

        let repeat_btn = new BaseSprite(this.game.settings['path']['img'] + 'win/repeat-btn.svg','repeat-btn','win',repeatBtnX,repeatBtnY,135,130,' ');
		let arrow = new BaseSprite(this.game.settings['path']['img'] + 'win/arrow.svg','arrow','win',repeatBtnX - 100,repeatBtnY + 100,90,91,' ');
			
	    this.items.push(bg);
	    this.items.push(hero_win);
	    this.items.push(win_text);
	    this.items.push(repeat_btn);
	    this.items.push(arrow);
	        
	    this.tweens['tweenArrowWin'] = gsap.to(arrow, {_y : repeatBtnY + 120, duration : 1 , repeat: -1, yoyo:true});
        this.scale(this.game.scale)
    }

    checkMouseMove(e){

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