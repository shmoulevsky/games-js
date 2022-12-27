import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import ScenePositionerHorizontal from './../../../base/Utils/ScenePositionerHorizontal'
import DefaultCard from "../../../base/Cards/DefaultCard";

// основной класс игры
export default class MainScreen extends GameScreen{
		
    constructor(bgImg, game, width = 800, height = 600){
        super();
        this.basket = [];
        this.width = width;
        this.height = height;
        this.game = game;
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

        window.addEventListener("keydown", (e) => {
            let num = parseInt(e.key) || 0;
            this.checkKeyDown(num);
        })

    }



    prepareRound()
    {
        this.items = [];
        this.gameResult = 0;
        this.userResult = 0;
        this.digitPosition = 0;
        this.currentDigitPosition = 0;
        this.game.secondsShort = this.game.settings.time.short;

        if(this.bg){
            let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','bg',0,0,this.width,this.height,' ');
            this.items.push(bg);
        }

        
        let btn = new BaseSprite(this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn','update',730,533,50,49,' ');
        this.items.push(btn);
        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);

        this.count1 = this.game.helper.getRandomInt(1,10);
        this.count2 = this.game.helper.getRandomInt(1,10);
        this.gameResult = this.count1 * this.count2;
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
                this.game.uiManager.sounds['wrong'].play();

                setTimeout(() => {
                    this.prepareRound();
                    this.game.isPaused = false;
                }, 200);
            }


        }, 1000);

    }

    makeDigits(){

        this.defaultCard.cardBg = new Image();
        this.defaultCard.cardBg.src = this.game.settings.path.img+'/cards/card.svg';
        this.defaultCard.cardBg.onload = () => {

            let startCardX = 160;
            let startCardY = 340;

            let cards = [
                {name : 'card1', value : this.count1},
                {name : 'sign', value : '*'},
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
                countInRow
            );


            for(let i = 0; i < 10;i++)
            {
                let coords = scenePositioner.getCoords(i);
                let card = this.textCardManager.createCard(
                    this.defaultCard.cardBg,
                    this.defaultCard.canvasId,
                    this.defaultCard.tag,
                    i,
                    i ,
                    0,
                    0,
                    this.defaultCard.width,
                    this.defaultCard.height,
                    this.defaultCard.isDraggable,
                    this.defaultCard.canDrag,
                    this.defaultCard.fontStyle
                );
                card._x = coords.x;
                card._y = coords.y;
                card.value = parseInt(i);
                this.items.push(card);
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
            
            if(this.items[i].type === 'digit' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
                this.checkResult(this.items[i].value);
            }

            if(this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
                    this.prepareRound();

            }
        }
       
    }

    checkMouseUp(e){
		        
        for(var i=0;i<this.items.length;i++){

            if(this.items[i].type === 'sort' && this.game.helper.isIntersect(this.items[i],this.items[1]) && this.items[i].isDraggable)
            {
                this.items[i].isAnimated = true;
                
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
			
        this.game.ctx.fillStyle = "#111";
        this.game.ctx.font = "20pt Arial";
        this.game.ctx.fillText(this.game.uiManager.right , 600, 50);
        this.game.ctx.fillText(this.game.uiManager.wrong , 700, 50);
        this.game.ctx.fillText(this.game.uiManager.points , 400, 50);
        this.game.ctx.fillStyle = '#FF0000';
        this.game.ctx.fillRect(0, 0, 800 - ((800 / this.game.settings.time.short) * this.game.secondsShort), 10);

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
            
            this.game.ctx.fillText(this.minutes + ':' + this.seconds , 30, 50);
        
    }

    checkResult(value) {
        let item = this.textCardManager.createCard(
            this.defaultCard.cardBg,
            this.defaultCard.canvasId,
            'result-card',
            'result-card',
            value,
            460+(75*this.currentDigitPosition),
            340,
            this.defaultCard.width,
            this.defaultCard.height,
            this.defaultCard.isDraggable,
            this.defaultCard.canDrag,
            this.defaultCard.fontStyle
        );

        if(this.currentDigitPosition >= this.digitPosition) return;
        this.items.push(item);
        this.userResult = parseInt((this.userResult).toString() + (value).toString());
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
            this.game.uiManager.sounds['wrong'].play();

            setTimeout(() => {
                this.prepareRound()
            }, 1000);


        }


    }
}