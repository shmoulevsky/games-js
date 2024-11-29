import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import TextSimpleCard from "../../../base/Images/TextSimpleCard";
import DefaultSimpleCard from "../../../base/Cards/DefaultSimpleCard";
import UIRenderer from "../../../base/UI/UIRenderer";

// основной класс игры
export class MainScreen extends GameScreen{
		
    constructor(bgImg, game, hero){
        super();
        this.basket = [];
        this.hero = hero;
        this.game = game;
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.uiRenderer = new UIRenderer();
        this.game.isPaused = true;
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();
        this.defaultSimpleCard = new DefaultSimpleCard();
        this.cardManager = new CardManager();
        this.game.settings.count = 15;


    }

    initScene(){

        this.setTimer();
        this.prepareRound();
        this.game.isPaused = false;

    }


    prepareRound()
    {
        this.items = [];
        this.currentResultCount = 0;

        if(this.bg){
            let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','bg',0,0,this.width,this.height,' ');
            this.items.push(bg);
        }

        if(this.hero){
            let hero = new BaseSprite( this.game.settings.path.img + this.hero.path,'hero','hero',this.hero.x,this.hero.y,this.hero.width,this.hero.height,' ');
            this.items.push(hero);
        }

        let btn = new BaseSprite(this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn','update',this.game.settings.width - 100,this.game.settings.height - 100,50,49,' ');
        this.items.push(btn);

        this.currentDigit = this.game.helper.getRandomInt(2, 18);

        this.basket = new BaseSprite(this.game.settings.path.img + 'basket/house-simple.svg',
            'basket','basket',60,160,165,260,this.currentDigit);

        this.basket.scale = 1;
        this.basket.value = this.currentDigit;

        this.items.push(this.basket);
        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);
        this.makeCards();


    }

    makeCards(){

        this.defaultSimpleCard.style.offsetX = 10;
        this.defaultSimpleCard.style.offsetY = 40;
        let arCards = [];

        for (let i=0; i <= this.currentDigit; i++) {

            let first = i;
            let second = this.currentDigit-i;

            arCards.push({
                text : first.toString()+'+'+second.toString()+'=?',
                value : parseInt(first)+parseInt(second),
            });

            arCards.push({
                text : second.toString()+'+'+first.toString()+'=?',
                value : parseInt(first)+parseInt(second),
            });

        }

        arCards = this.game.helper.shuffle(arCards);
        this.currentCount =  this.game.helper.getRandomInt(0, arCards.length);

        let items = []

        for (let i=0; i <= this.game.settings.count; i++) {

            let first = this.game.helper.getRandomInt(0, 9);
            let second = this.game.helper.getRandomInt(0, 9);

            let item = new TextSimpleCard(
                'card-'+ i,
                'card',
                this.game.helper.getRandomInt(290, 650),
                this.game.helper.getRandomInt(80, 500) ,
                150,
                50,
                first.toString()+'+'+second.toString()+'=?',
                parseInt(first)+parseInt(second),
                false,
                true ,
                this.defaultSimpleCard.style
            );

            items.push(item);
        }

        for (let i=0; i < this.currentCount; i++) {

            let item = new TextSimpleCard(
                'card-'+ i,
                'card',
                this.game.helper.getRandomInt(290, 650),
                this.game.helper.getRandomInt(80, 500) ,
                150,
                50,
                arCards[i].text,
                arCards[i].value,
                false,
                true ,
                this.defaultSimpleCard.style
            );

            items.push(item);
        }

        items = this.game.helper.shuffle(items);

        for (const key in items) {
            this.items.push(items[key]);
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

            if(this.items[i].type === 'card' && this.game.helper.isIntersect(this.items[i],this.basket) && this.items[i].isShow)
            {

                if(this.items[i].value === this.basket.value){

                    this.game.uiManager.right++;
                    this.currentResultCount++;
                    this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                    this.game.uiManager.tweens['ok'].play();
                    this.game.uiManager.tweens['ok'].restart();

                    if(this.currentCount === this.currentResultCount){
                        setTimeout(() => {
                            this.prepareRound()
                        }, 1000);
                    }


                }else{
                    this.game.uiManager.wrong++;
                }

                this.items[i].isShow = false;

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

        let stripeWidth = this.game.settings.width - ((this.game.settings.width / this.game.settings.time.short) * this.game.secondsShort) / 10;

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

        let offsetX = this.currentDigit <= 9 ? 120 : 101;

        this.game.ctx.font = "40pt Arial";
        this.game.ctx.fillText(this.currentDigit , offsetX, 240);
        this.game.ctx.font = "20pt Arial";

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