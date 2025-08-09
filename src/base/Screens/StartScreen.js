import GameScreen from './GameScreen'
import BaseSprite from '../Images/BaseSprite'
import gsap from "gsap";
import ColorfulText from "../UI/ColorfulText";
import Translation from "../Translations/Translation";

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
        this.translation = new Translation()
        
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

        let hero = {}

        if(this.hero){
            hero = new BaseSprite( this.game.settings.path.img + this.hero.path,'hero','hero',this.hero.x,this.hero.y,this.hero.width,this.hero.height,' ');
            this.items.push(hero);
            this.tweens['tweenHero'] = gsap.to(hero, {_y : this.game.getScaled(hero._y - 50), duration : 3, repeat: -1, yoyo:true});
        }

	    this.items.push(btn);
	    this.items.push(arrow);

        const titleText = new ColorfulText('gradient', 400, 200, 'Math-Owl.com', {
            fontSize: 60,
            color: '#ffffff',
            fontWeight: 'bold',
            //gradientColors: ['#ffffff', 'rgba(26,99,232,0.5)', '#45b7d1'],
            //gradientDirection: 'horizontal',
            glowColor: '#f8ff5c',
            glowBlur: 20,
            float: true,
            canDrag: false,
            floatAmplitude: 10,
            floatSpeed: 0.025
        });

        // Радужный пульсирующий перетаскиваемый текст
        const interactiveText = new ColorfulText('interactive', 500, 600, this.translation.make(this.game.settings.lang, 'play'), {
            fontSize: 36,
            fontWeight: 'bold',
            pulse: true,
            pulseMin: 0.8,
            pulseMax: 1.2,
            canDrag: false
        });

        this.items.push(titleText);
        this.items.push(interactiveText);

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