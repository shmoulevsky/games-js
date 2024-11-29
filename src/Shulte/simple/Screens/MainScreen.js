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
        this.game.settings.digitsCount = 8;
        this.game.settings.digitsCount = Math.pow(this.game.settings.digitsCount, 2);
        this.game.settings.lastDigit = [];
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


        let btn = new BaseSprite(this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn','update',this.game.settings.width - 100,this.game.settings.height - 100,50,49,' ');
        this.items.push(btn);

        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);
        this.makeCards();


    }

    makeCards(){

        let cardBg = new Image();
        cardBg.src = this.game.settings.path.img + 'cards/card.svg';
        this.game.arSymbols = [];
        this.game.arSymbolsUse = [];
        this.game.arSymbols = this.game.helper.getArrayABC('$','_', 'RU');

        this.game.helper.shuffle(this.game.arSymbols);

        let cardWidth = 61;
        let cardHeight = 61;

        let fontStyle = {};
        fontStyle.size = '40';
        fontStyle.font = 'Calibri';
        fontStyle.color1 = 'black';
        fontStyle.color2 = 'red';
        fontStyle.x = 20;
        fontStyle.xoffset = 10;
        fontStyle.y = 40;
        let count = 0;

        cardBg.onload = () => {

            for(let i=0;i<Math.sqrt(this.game.settings.digitsCount);i++)
            {
                for(let j=0;j<Math.sqrt(this.game.settings.digitsCount);j++)
                {
                    let card = new TextCard('', 'card-' + count,'card', j * (cardWidth - 1) + 60*this.game.scale , i * (cardHeight - 1) + 100*this.game.scale,cardWidth,cardHeight, this.game.arSymbols[count], false, false, 'card-canvas', cardBg, 2, fontStyle);
                    this.game.arSymbolsUse.push(this.game.arSymbols[count]);
                    card.setScale(this.game.scale)
                    this.items.push(card);
                    count++;
                }

            }

            count = 0;

            for(let i=0;i<Math.sqrt(this.game.settings.digitsCount);i++){
                for(let j=0;j<Math.sqrt(this.game.settings.digitsCount);j++){
                    let card = new TextCard('',
                        'need_card-' + count,'need_card',
                        700 ,
                        100 ,
                        cardWidth,
                        cardHeight,
                        this.game.arSymbols[count],
                        false, false, 'card-canvas', cardBg, 2,
                        fontStyle);

                    card.isShow = false;
                    card.setScale(this.game.scale)
                    this.items.push(card);
                    count++;
                }
            }

            this.restart();

        }

    }

    restart(){

        let end = this.game.settings.lastDigit.length;
        this.game.settings.currentDigit = this.game.helper.getRandomArrayItem(this.game.arSymbolsUse);

        while(this.game.settings.currentDigit === this.game.settings.lastDigit[end - 1])
        {
            this.game.settings.currentDigit = this.game.helper.getRandomArrayItem(this.game.arSymbolsUse);
        }

        for(let i = 0;i < this.items.length;i++)
        {

            if(this.items[i].type === 'card') {
                this.items[i].pos = 0;
            }

            if(this.items[i].type === 'need_card') {

                this.items[i].isShow = false;
                this.items[i].pos = 0;

                if(this.items[i].value === this.game.settings.currentDigit){
                    this.items[i].isShow = true;
                }
            }
            if(end - 2 >= 0 && end > 1) {
                if(this.game.settings.lastDigit[end - 2] === this.items[i].value) {
                    this.items[i].pos = 0;
                }
            }

        }


    }

    checkMouseMove(e){

    }
    
    checkMouseClick(e){

        for(let i=0;i<this.items.length;i++) {

            if(this.items[i].type === 'card' && this.game.helper.isClick(e, this.items[i]) && this.items[i].isShow)
            {
                this.items[i].pos = 1;

                if(this.items[i].value === this.game.settings.currentDigit){

                    this.game.uiManager.right++;
                    this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                    this.game.uiManager.tweens['ok'].play();
                    this.game.uiManager.tweens['ok'].restart();
                    //this.items[i].pos = 1;

                    if(this.game.settings.currentDigit >= this.game.settings.digitsCount)
                    {
                        this.game.showScreen(0,1);
                        clearInterval(this.game.timerId);
                    }

                    this.game.settings.lastDigit.push(this.game.settings.currentDigit);

                    setTimeout(() => {
                        this.restart();
                    }, 200);


                }else{
                    this.game.uiManager.wrong++;
                }
            }

            if(this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){
                this.restart();

            }

        }
       
    }

    checkMouseUp(e){

        for(let i=0;i<this.items.length;i++){
            if(this.items[i].type === 'card'
                && this.game.helper.isIntersect(this.items[i],this.items[1])
                && this.items[i].isShow){
                    this.checkResult(this.items[i])
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