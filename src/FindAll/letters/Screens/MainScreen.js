import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import TextSimpleCard from "../../../base/Images/TextSimpleCard";
import DefaultSimpleCard from "../../../base/Cards/DefaultSimpleCard";
import TextTransparentCard from "../../../base/Images/TextTransparentCard";
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

        this.currentLetter = this.game.helper.getRandomInt(0, 32);
        this.currentLetterCount = this.game.helper.getRandomInt(3, 10);
        this.currentCount = this.game.helper.getRandomInt(30, 65);

        this.basket = new BaseSprite(this.game.settings.path.img + 'basket/house-simple.svg',
            'basket','basket',60,160,165,260,this.currentDigit);

        this.basket.scale = 1;
        this.basket.value = this.currentLetter;

        this.items.push(this.basket);
        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);
        this.makeCards();


    }

    makeCards(){


        let colors = ['red', 'orange', 'green', 'blue', 'purple', 'gold', 'Olive', 'grey', 'pink', 'DarkOrchid', 'Moccasin'];
        let fonts = ['Arial','Verdana','Tahoma','Trebuchet MS','Times New Roman','Georgia','Garamond'];

        let arCards = [];
        this.arSymbols = [];
        this.arSymbols = this.game.helper.getArrayABC('А','я', 'RU');

        for (let i=0; i <= this.arSymbols.length; i++) {

            arCards.push({
                text : this.arSymbols[i],
                value : i,
            });

        }

        let items = [];

        for (let i=0; i < this.currentLetterCount; i++) {

            let letterColor = this.game.helper.getRandomInt(0, 10);
            let letterSize = this.game.helper.getRandomInt(20, 40);
            let letterFont = this.game.helper.getRandomInt(0, 6);



            let item = new TextTransparentCard(
                'card-'+ i,
                'card',
                this.game.helper.getRandomInt(290, 650),
                this.game.helper.getRandomInt(80, 500) ,
                letterSize*1.1,
                letterSize*1.1,
                arCards[this.currentLetter].text,
                arCards[this.currentLetter].value,
                false,
                true ,
                0,
                letterSize,
                colors[letterColor],
                letterSize,
                fonts[letterFont]
            );

            items.push(item);
        }

        for (let i=0; i < this.currentCount; i++) {

            let letterNum = this.game.helper.getRandomInt(0, 33);

            while(letterNum === this.currentLetter){
                letterNum = this.game.helper.getRandomInt(0, 33);
            }


            let letterColor = this.game.helper.getRandomInt(0, 10);
            let letterSize = this.game.helper.getRandomInt(20, 40);
            let letterFont = this.game.helper.getRandomInt(0, 6);



            let item = new TextTransparentCard(
                'card-'+ i,
                'card',
                this.game.helper.getRandomInt(290, 650),
                this.game.helper.getRandomInt(80, 500) ,
                letterSize*1.1,
                letterSize*1.1,
                arCards[letterNum].text,
                arCards[letterNum].value,
                false,
                true ,
                0,
                letterSize,
                colors[letterColor],
                letterSize,
                fonts[letterFont]
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

                    if(this.currentLetterCount === this.currentResultCount){
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

        this.game.ctx.font = "40pt Arial";


        this.game.ctx.fillText(this.arSymbols[this.currentLetter] , 120, 240);
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
}