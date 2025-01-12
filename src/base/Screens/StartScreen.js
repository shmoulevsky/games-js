import GameScreen from './GameScreen'
import BaseSprite from '../Images/BaseSprite'
import gsap from "gsap";

// основной класс игры
export default class StartScreen extends GameScreen{
		
    constructor(bgImg, game, hero){
        super();


        this.basket = [];
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.game = game;
        this.bg = bgImg;
        this.hero = hero;
        this.name = 'start';
        this.title = game.settings.title ?? '';
        this.titleX = 80;
        this.titleY = (game.settings.height / 2) - 50;

        
    }

    initScene(){

        this.items = [];

        let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','win',0,0,this.width,this.height,' ');

        let btnX = 200;
        let btnY = 350;

        let arrowX = btnX - 80;
        let arrowY = btnY + 80;

        let btn = new BaseSprite(this.game.settings.path.img + 'start/play-btn.svg','start-btn','win', btnX, btnY,136,136,' ');
		let arrow = new BaseSprite(this.game.settings.path.img + 'win/arrow.svg','arrow','win',arrowX,arrowY,90,91,' ');

        this.items.push(bg);

        if(this.hero){
            let hero = new BaseSprite( this.game.settings.path.img + this.hero.path,'hero','hero',this.hero.x,this.hero.y,this.hero.width,this.hero.height,' ');
            this.items.push(hero);
        }

	    this.items.push(btn);
	    this.items.push(arrow);
	        
	    this.tweens['tweenArrowWin'] = gsap.to(arrow, {_y : this.game.getScaled(btnY + 50), duration : 1, repeat: -1, yoyo:true});
        this.scale(this.game.scale);
    }

    checkMouseMove(e){

    }


    checkMouseClick(e){
		
        if(typeof(e) == 'undefined') return;
        if(!this.isShow) return;
        
        for(let i=0;i<this.items.length;i++){
                        
            if(this.items[i].name === 'start-btn' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){

                    setTimeout(() => {
                        this.game.showScreen(0,1);
                        this.game.screens[1].initScene();
                    }, 10);

                    e.preventDefault();
                    return;
            }
        }
       
    }

    
    // цикл отрисовки
    render(){

        this.game.ctx.fillStyle = "#fff";
        this.game.ctx.font = "48pt Arial";
        this.game.ctx.fillText(this.title , this.titleX, this.titleY);
        
    }

}