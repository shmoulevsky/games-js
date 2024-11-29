import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import ScenePositionerHorizontal from './../../../base/Utils/ScenePositionerHorizontal'
import DefaultCard from "../../../base/Cards/DefaultCard";
import RectangleShape from "../../../base/Shapes/RectangleShape";
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
        this.defaultCard = new DefaultCard();
    }

    initScene(){
        this.setTimer(); 
        this.prepareRound();
        this.game.isPaused = false;
    }



    prepareRound()
    {
        this.items = [];
        this.gameResult = 0;
        this.userResult = 0;
        this.digitPosition = 0;
        this.currentDigitPosition = 0;
        this.game.secondsShort = this.game.settings.time.short * 10;

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

        this.count1 = this.game.helper.getRandomInt(1,15);
        this.count2 = this.game.helper.getRandomInt(1,15);
        this.gameResult = this.count1 + this.count2;
        this.digitPosition = this.gameResult.toString().length;

        this.makeDigits();
        clearInterval(this.game.timerShortId);

        this.game.timerShortId = setInterval(() => {

            if(!this.game.isPaused){
                this.game.secondsShort--;
            }

            if(this.game.secondsShort === 0) {

                clearInterval(this.game.timerShortId);
                this.game.isPaused = true;

                this.game.uiManager.wrong++;
                this.game.uiManager.tweens['wrong'].play();
                this.game.uiManager.tweens['wrong'].restart();
                //this.game.uiManager.sounds['wrong'].play();

                setTimeout(() => {
                    this.prepareRound();
                    this.game.isPaused = false;
                }, 200);
            }


        }, 100);

    }

    makeDigits(){

        this.defaultCard.cardBg = new Image();
        this.defaultCard.cardBg.src = this.game.settings.path.img+'/cards/card.svg';
        this.defaultCard.cardBg.onload = () => {

            let startCardX = 160;
            let startCardY = 340;

            let cards = [
                {name : 'card1', value : this.count1},
                {name : 'sign', value : '+'},
                {name : 'card2', value : this.count2},
                {name : 'equal', value : '='},
            ];

            for(let i=0;i<this.gameResult.toString().length;i++){
                cards.push({name : 'res', value : ' '});
            }


            for(let key in cards){
                let item = this.textCardManager.createCard(
                    this.defaultCard.cardBg,
                    this.defaultCard.canvasId,
                    this.defaultCard.tag + '-card',
                    cards[key].name,
                    cards[key].value,
                    0,
                    0,
                    this.defaultCard.width,
                    this.defaultCard.height,
                    this.defaultCard.isDraggable,
                    this.defaultCard.canDrag,
                    this.defaultCard.fontStyle
                );
                item._x = startCardX+(key*75);
                item._y = startCardY;
                item.value = cards[key].value;
                this.items.push(item);
            }

            let startX = 30;
            let startY = 120;
            let offsetX = 75;
            let offsetY = 80;
            let countInRow = 10;

            let scenePositioner = new ScenePositionerHorizontal(
                startX,
                startY,
                offsetX,
                offsetY,
                countInRow,
                this.game.scale
            );

            let values = [0,1,2,3,4,5,6,7,8,9];
            let colors = ['red', 'orange', 'green', 'blue', 'purple', 'gold', 'Olive', 'grey', 'pink', 'DarkOrchid', 'Moccasin'];
            let borderColors = ['red', 'orange', 'green', 'blue', 'purple', 'gold', 'Olive', 'grey', 'pink', 'DarkOrchid', 'Moccasin'];

            this.colors = this.game.helper.shuffle(colors);
            this.values = this.game.helper.shuffle(values);
            this.borderColors = borderColors;

            let colorCards = [];

            for(let i = 0; i < 10;i++) {
                let coords = scenePositioner.getCoords(i);
                let card = new RectangleShape('rect', 'rect', coords.x , coords.y , 60, 60, this.values[i], this.colors[i], this.borderColors[i], false, false);
                colorCards.push(card);
                this.items.push(card);
            }

            for(let i = 0; i < 10;i++) {
                let colorCard = colorCards.filter((item) => {return item.value === i});
                let sign = new RectangleShape('sign', 'sign', 30 , (i * 40) + 200 , 30, 30, i, colorCard[0].color, this.borderColors[i], false, false);
                this.items.push(sign);
            }


        }

    }

    checkMouseMove(e){

    }

    checkKeyDown(key){
        this.checkResult(key);
    }
    
    checkMouseClick(e){
				
        for(let i=0;i<this.items.length;i++){
            
            if(this.items[i].type === 'rect' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
                this.checkResult(this.items[i]);
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

        this.game.ctx.fillStyle = "#fff";
        for(let i = 0; i < 10;i++) {
            this.game.ctx.fillText('=' + i , 70 , (i * 40) + 224);
            this.game.ctx.strokeRect(70 - 45 , (i * 40) + 224 - 28, 80, 40);
        }

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

    checkResult(item) {
        let answer =  new RectangleShape(
            'result',
            'result',
            460+(75*this.currentDigitPosition),
            340,
            70,
            70,
            item.value,
            item.color,
            item.borderColor,
            false,
            false
        );

        if(this.currentDigitPosition >= this.digitPosition) return;
        this.items.push(answer);

        this.userResult = parseInt((this.userResult).toString() + (item.value).toString());
        this.currentDigitPosition++;

        if(this.digitPosition !== this.currentDigitPosition) return;

        if(this.userResult === this.gameResult){
            this.game.uiManager.right++;
            this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
            this.game.uiManager.tweens['ok'].play();
            this.game.uiManager.tweens['ok'].restart();

            setTimeout(() => {
                this.prepareRound()
            }, 1000);

        }else{

            this.game.uiManager.wrong++;
            this.game.uiManager.tweens['wrong'].play();
            this.game.uiManager.tweens['wrong'].restart();
            //this.game.uiManager.sounds['wrong'].play();

            setTimeout(() => {
                this.prepareRound()
            }, 1000);


        }


    }
}