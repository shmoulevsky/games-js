import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import TextCard from "../../../base/Images/TextCard";
import Card from "../../../base/Images/Card";
import UIRenderer from "../../../base/UI/UIRenderer";

// основной класс игры
export class MainScreen extends GameScreen{
		
    constructor(bgImg, game, hero){
        super();
        this.basket = [];

        this.game = game;
        this.hero = hero;
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.game.isPaused = false;
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();
        this.defaultCard = new DefaultCard();
        this.cardManager = new CardManager();
        this.uiRenderer = new UIRenderer();

        this.game.settings.fromImg = 1;
        this.game.settings.toImg = 1;
        this.game.settings.seconds_left_var = 3;
        this.name = 'game';

    }

    initScene(){
        this.setTimer();
        this.prepareRound();
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

        for(let i = 0;i < 5;i++)
            for(let j = 0;j < 5;j++)
            {
                let card = new Card(this.game.settings.path.img + 'cards/card3.svg','pole-' + i,'pole', 0, 0, 90, 90,' ' , false, false, 3);
                card._x = i * card._width + 90;
                card._y = j * card._height + 90;
                card.coords = [];
                card.coords.push(i);
                card.coords.push(j);
                this.items.push(card);
            }

        this.restart();
    }

    restart(){

        this.game.settings.coords = [];
        this.game.settings.fromImg++;
        this.game.settings.toImg++;
        this.game.settings.seconds_left_var++;

        this.game.settings.countImg = this.game.helper.getRandomInt(this.game.settings.fromImg, this.game.settings.toImg);
        this.game.settings.cardsRight = 0;

        this.game.settings.hide_cards = false;
        this.game.settings.timer_stop = false;

        let arDel = [];

        for(let i=0;i<this.items.length;i++)
        {
            if(this.items[i].type === 'card') {
                arDel.push(i);
            }
        }

        for(let i=0;i<arDel.length;i++)
        {
            this.items.splice(arDel[i] - i, 1);
        }

        let l = this.items.length;

        let arCoords = [];

        for(let i = 0;i < 5;i++)
            for(let j = 0;j < 5;j++){
                arCoords.push([i,j]);
            }

        this.game.helper.shuffle(arCoords);

        for(let i = 0;i <= this.game.settings.countImg;i++)
        {
            let x0 = this.game.getScaled(arCoords[i][0]);
            let y0 = this.game.getScaled(arCoords[i][1]);
            let x = this.game.getScaled(x0 * 90 + 90);
            let y = this.game.getScaled(y0 * 90 + 90);
            this.game.settings.coords[i] = [];
            this.game.settings.coords[i].push(x0);
            this.game.settings.coords[i].push(y0);
            this.game.settings.coords[i].push(l + i);

            let card = new Card(this.game.settings.path.img + 'cards/card-memory.svg','card-' + i,'card', 0, 0, 90, 90,' ' , false, false, 3);

            card._x = x;
            card._y = y;
            card.pos = 1;

            card.coords = [];
            card.coords.push(x0);
            card.coords.push(y0);
            card.setScale(this.game.scale)
            this.items.push(card);


        }

        this.game.settings.seconds_left = this.game.settings.seconds_left_var;

        for(let i=0;i<this.items.length;i++) {
            this.items[i].setScale(this.game.scale);
        }

    }

    checkCards(){

        if(this.game.settings.hide_cards)
        {
            for(let i=0;i<this.items.length;i++)
            {
                if(this.items[i].type === 'card' && this.items[i].isShow) {
                    this.items[i].isShow = false;
                }
            }
        }

        this.game.settings.timer_stop = true;

    }


    checkMouseMove(e){

    }

    checkMouseClick(e){

        if(this.game.settings.hide_cards === false) return;

        let isBreak = false;

        for(let i=0;i<this.items.length;i++)
        {
            if(this.items[i].type === 'pole' && this.game.helper.isClick(e, this.items[i]) && this.items[i].isShow)
            {

                for(let j=0;j<=this.game.settings.countImg;j++)
                {

                    if(this.items[i].coords[0] === this.game.settings.coords[j][0]
                        && this.items[i].coords[1] === this.game.settings.coords[j][1]){
                        this.items[this.game.settings['coords'][j][2]].isShow = true;
                        isBreak = true;
                    }

                }
                if(isBreak){

                    this.game.uiManager.right++;
                    this.game.settings.cardsRight++;
                    this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                    this.game.uiManager.tweens['ok'].play();
                    this.game.uiManager.tweens['ok'].restart();
                    break;

                }else{

                    let card = new Card(this.game.settings.path.img + 'cards/card-cross.svg','card-' + i,'card', this.items[i].coords[0] * 90 + 90, this.items[i].coords[1] * 90 + 90, 90, 90,' ' , false, false, 3);
                    this.items.push(card);
                    this.game.uiManager.wrong++;

                }
            }

            if(isBreak) break;

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


        if(this.game.settings.cardsRight >= (this.game.settings.countImg + 1)) {
            this.restart();
        }

        if(this.game.settings.seconds_left > 0 ) {
            this.game.settings.seconds_left--;
        }else if(!this.game.settings.timer_stop){
            this.game.settings.hide_cards = true;
            this.checkCards();
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
            stripeWidth
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

    checkResult() {


    }

}