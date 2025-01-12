import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import Card from "../../../base/Images/Card";
import gsap from "gsap";
import UIRenderer from "../../../base/UI/UIRenderer";

// основной класс игры
export  class MainScreen extends GameScreen{
		
    constructor(bgImg, game, hero){
        super();
        this.basket = [];
        this.game = game;
        this.hero = hero;
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.game.isPaused = true;
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();
        this.defaultCard = new DefaultCard();
        this.cardManager = new CardManager();
        this.uiRenderer = new UIRenderer();
        this.game.settings.figCount = 3;
        this.name = 'game';

    }

    initScene(){

        this.setTimer();
        this.prepareRound();
        this.game.isPaused = false;

    }


    prepareRound()
    {
        this.items = [];

        if(this.bg){
            let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','bg',0,0,this.width,this.height,' ');
            this.items.push(bg);
        }

        if(this.hero){
            let hero = new BaseSprite( this.game.settings.path.img + this.hero.path,'hero','hero',this.hero.x,this.hero.y,this.hero.width,this.hero.height,' ');
            this.items.push(hero);
        }


        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);
        this.makeCards();


    }

    makeCards(){

        let q = 0.7*this.game.scale;

        for(let i = 1;i <= 3;i++) {
            let house = new BaseSprite(this.game.settings.path.img + 'basket/house-'+i+'.svg','house-'+i,'house',this.game.getScaled(240 * (i-1) + 80),this.game.getScaled(120),220 ,379 , i);

            house._iwidth *= q;
            house._iheight *= q;
            house.setScale(q)
            this.items.push(house);
            this.basket.push(house);

        }

        for(let i = 0;i < this.game.settings.figCount * 3;i++) {
            let fig = new Card( this.game.settings.path.img + 'cards/fig-'+(i % 3 + 1)+'.svg','fig-' + i, 'fig', 0, 0,70,100, i % 3 + 1, false, true);
            fig.setScale(this.game.scale)
            this.items.push(fig);
        }

        this.restart();

    }

    restart(){

        for(let i = 0;i < this.items.length;i++)
        {
            if(this.items[i].type === 'fig')
            {
                this.items[i].isShow = true;
                this.items[i]._x = this.game.getScaled(this.game.helper.getRandomInt(50, 750));
                this.items[i]._y = this.game.getScaled(this.game.helper.getRandomInt(390, 500));
            }

        }


    }

    checkMouseMove(e){

    }
    
    checkMouseClick(e){
				
        for(let i=0;i<this.items.length;i++){
            
            if(this.items[i].type === 'card' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
            }

            if(this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
                    this.prepareRound();

            }
        }
       
    }

    checkMouseUp(e){

        for(let i=0;i<this.items.length;i++)
        {
            for(let j=0;j<this.basket.length;j++)
            {
                if(this.items[i].type === 'fig' && this.game.helper.isIntersect(this.items[i],this.basket[j]) && this.items[i].isShow)
                {

                    if(this.items[i].value === this.basket[j].value){

                        this.game.uiManager.right++;
                        this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                        this.game.uiManager.tweens['ok'].play();
                        this.game.uiManager.tweens['ok'].restart();

                        if(parseInt(this.game.uiManager.right) + parseInt(this.game.uiManager.wrong) >= this.game.settings.figCount*3)
                        {
                            this.game.showScreen(1,2);
                            clearInterval(this.game.timerId);
                        }

                    }else{
                        this.game.uiManager.wrong++;
                    }

                    this.items[i].isShow = false;

                }
            }
        }

    }

    // таймер
    setTimer(){

        this.game.minutes = this.game.settings.time.all;

        clearInterval(this.game.timerId);
        
        this.game.timerId = setInterval(() => {

        if(!this.game.isPaused){
            this.game.seconds--;
        }

        if(this.game.minutes === 0 && this.game.seconds === 0) {
            this.game.showScreen(1,2); 
            clearInterval(this.game.timerId);
           
        }
      
        if(this.game.seconds <= 0 && this.game.minutes > 0)
        {
            this.game.seconds = 59;
              this.game.minutes--;
        }
    
    }, 1000);
        
        
    }

    // цикл отрисовки
    render(){

        this.uiRenderer.render(
            this.game.ctx,
            this.game.uiManager.right,
            this.game.uiManager.wrong,
            this.game.uiManager.points,
            this.game.settings.width,
            this.game.settings.height,
            this.minutes,
            this.seconds,
            0
        );

        if(this.game.seconds < 10)
            {
                this.seconds = '0' + this.game.seconds;
            }else{
                this.seconds = this.game.seconds
            }
            
            if(this.game.minutes < 10)
            {
                this.minutes = '0' + this.game.minutes;
            }else{
                this.minutes = this.game.minutes;
            }

    }

    checkResult(result) {

        if(result){
            this.game.uiManager.right++;
            this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
            this.game.uiManager.tweens['ok'].play();
            this.game.uiManager.tweens['ok'].restart();

        }else{
            this.game.uiManager.wrong++;
            this.game.uiManager.tweens['wrong'].play();
            this.game.uiManager.tweens['wrong'].restart();
        }


    }
}