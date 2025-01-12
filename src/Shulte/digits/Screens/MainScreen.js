import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import TextCard from "../../../base/Images/TextCard";
import UIRenderer from "../../../base/UI/UIRenderer";

// основной класс игры
export class MainScreen extends GameScreen{
		
    constructor(bgImg, game, hero){
        super();
        this.basket = [];
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.game = game;
        this.hero = hero;
        this.game.isPaused = true;
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();
        this.defaultCard = new DefaultCard();
        this.cardManager = new CardManager();
        this.uiRenderer = new UIRenderer();
        this.game.settings.digitsRow = 8;
        this.game.settings.digitsCount = Math.pow(this.game.settings.digitsRow, 2);
        this.game.settings.currentDigit = 0;
        this.name = 'game';
    }

    initScene(){

        this.setTimer();
        this.prepareRound();
        this.game.isPaused = false;
    }

    restart(){

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


        let btn = new BaseSprite(this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn','update',this.game.settings.width - 100,this.game.settings.height - 100,50,49,' ');
        this.items.push(btn);

        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);
        this.makeCards();

        for(let i=0;i<this.items.length;i++) {
            this.items[i].setScale(this.game.scale);
        }

    }

    makeCards(){

        let cardBg = new Image();
        cardBg.src = this.game.settings.path.img + 'cards/card.svg';

        this.game.arDigits = [];

        for(let i=0;i<this.game.settings.digitsCount;i++) {
            this.game.arDigits.push(i);
        }

        this.game.helper.shuffle(this.game.arDigits);


        let cardWidth = 61;
        let cardHeight = 61;

        let fontStyle = {};
        fontStyle.size = '40';
        fontStyle.font = 'Calibri';
        fontStyle.color1 = 'black';
        fontStyle.color2 = 'red';
        fontStyle.x = 19;
        fontStyle.xoffset = 7;
        fontStyle.y = 45;
        let count = 0;

        cardBg.onload = () => {

            for(let i=0;i<Math.sqrt(this.game.settings.digitsCount);i++){
                for(let j=0;j<Math.sqrt(this.game.settings.digitsCount);j++){

                    let card = new TextCard('', 'card-' + count,'card',
                        this.game.getScaled(j * (cardWidth - 1) + 60) ,
                        this.game.getScaled(i * (cardHeight - 1) + 100),
                        cardWidth,
                        cardHeight,
                        this.game.arDigits[count],
                        false,
                        false,
                        'card-canvas',
                        cardBg, 2, fontStyle);

                    card.setScale(this.game.scale)
                    this.items.push(card);
                    count++;
                }
            }
        }

    }

    checkMouseMove(e){

    }

    checkMouseClick(e){

        for(let i=0; i < this.items.length;i++) {

            if(this.items[i].type === 'card' && this.game.helper.isClick(e, this.items[i]) && this.items[i].isShow)
            {
                console.log(this.items[i].value, this.items[i].name, this.game.settings.currentDigit);

                if(this.items[i].value === this.game.settings.currentDigit){

                    this.game.uiManager.right++;
                    this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                    this.game.settings.currentDigit++;
                    this.items[i].pos = 1;
                    this.game.uiManager.tweens['ok'].play();
                    this.game.uiManager.tweens['ok'].restart();

                    if(this.game.settings.currentDigit >= this.game.settings.digitsCount)
                    {
                        this.game.showScreen(0,1);
                        clearInterval(this.game.timerId);
                    }

                }else{
                    this.game.uiManager.wrong++;
                }
            }

            if(this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){
                  this.prepareRound();
            }

        }
       
    }

    checkMouseUp(e){

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
}