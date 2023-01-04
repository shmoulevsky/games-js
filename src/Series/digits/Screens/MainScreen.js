import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import PermutationService from "../../../base/Utils/PermutationService";
import ScenePositionerHorizontal from "../../../base/Utils/ScenePositionerHorizontal";
import Card from "../../../base/Images/Card";

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
        this.gameResult = {};
    }

    initScene(){
        this.setTimer(); 
        this.prepareRound();
        this.game.isPaused = false;

    }



    prepareRound()
    {
        this.items = [];
        this.game.secondsShort = this.game.settings.time.short * 10;

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

        let service = new PermutationService();

        let range = this.game.helper.shuffle([...Array(24).keys()]);
        let types = this.game.helper.shuffle([...Array(99).keys()]);
        let arrDigits = [];

        let arr = service.handle([types[0],types[1], types[2], types[3]]);

        for(let i=0;i<=3;i++){
            for (let j = 0; j <= 3; j++) {
                arrDigits.push(arr[range[i]][j]);
            }
        }

        let startX = 120;
        let startY = 100;
        let offsetX = 90;
        let offsetY = 90;
        let countInRow = 4;

        let scenePositioner = new ScenePositionerHorizontal(
            startX,
            startY,
            offsetX,
            offsetY,
            countInRow
        );

        let digitPosition = this.game.helper.getRandomInt(0,15);

        this.defaultCard.cardBg = new Image();
        this.defaultCard.cardBg.src = this.game.settings.path.img+'/cards/card.svg';

        this.defaultCard.cardBg.onload = () => {
            for (let i = 0; i < 16; i++) {

                let coords = scenePositioner.getCoords(i);

                let card = this.textCardManager.createCard(
                    this.defaultCard.cardBg,
                    this.defaultCard.canvasId,
                    this.defaultCard.tag + '-card',
                    'card-' + i,
                    arrDigits[i],
                    coords.x,
                    coords.y,
                    this.defaultCard.width,
                    this.defaultCard.height,
                    this.defaultCard.isDraggable,
                    this.defaultCard.canDrag,
                    this.defaultCard.fontStyle
                );

                this.items.push(card);

                if(i === digitPosition){
                    this.gameResult.value = arrDigits[i];
                    this.gameResult.x = card._x;
                    this.gameResult.y = card._y;

                    let cardQuestion = this.textCardManager.createCard(
                        this.defaultCard.cardBg,
                        this.defaultCard.canvasId,
                        this.defaultCard.tag + '-card',
                        'card-question-' + i,
                        '?',
                        coords.x,
                        coords.y,
                        this.defaultCard.width,
                        this.defaultCard.height,
                        this.defaultCard.isDraggable,
                        this.defaultCard.canDrag,
                        this.defaultCard.fontStyle
                    );
                    cardQuestion.pos = 1;
                    this.items.push(cardQuestion);
                }


            }

            scenePositioner.init(
                startX,
                500,
                offsetX,
                offsetY,
                10
            );

            for (let i = 0; i < 4; i++) {

                let coords = scenePositioner.getCoords(i);
                let card = this.textCardManager.createCard(
                    this.defaultCard.cardBg,
                    this.defaultCard.canvasId,
                    'answer',
                    i,
                    arrDigits[i],
                    coords.x,
                    coords.y,
                    this.defaultCard.width,
                    this.defaultCard.height,
                    this.defaultCard.isDraggable,
                    this.defaultCard.canDrag,
                    this.defaultCard.fontStyle
                );

                this.items.push(card);
            }

        }






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


        }, 100);

    }

    checkMouseMove(e){

    }

    checkKeyDown(key){

    }
    
    checkMouseClick(e){
				
        for(let i=0;i<this.items.length;i++){
            
            if(this.items[i].type === 'answer' &&
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
			
        this.game.ctx.fillStyle = "#111";
        this.game.ctx.font = "20pt Arial";
        this.game.ctx.fillText(this.game.uiManager.right , 600, 50);
        this.game.ctx.fillText(this.game.uiManager.wrong , 700, 50);
        this.game.ctx.fillText(this.game.uiManager.points , 400, 50);
        this.game.ctx.fillStyle = '#FF0000';

        let width = 800 - ((800 / this.game.settings.time.short) * this.game.secondsShort) / 10;
        this.game.ctx.fillRect(0, 0, width, 10);


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

    checkResult(item) {

        let copyCard = this.textCardManager.createCard(
            this.defaultCard.cardBg,
            this.defaultCard.canvasId,
            'result-card',
            '0',
            item.value,
            this.gameResult.x,
            this.gameResult.y,
            this.defaultCard.width,
            this.defaultCard.height,
            this.defaultCard.isDraggable,
            this.defaultCard.canDrag,
            this.defaultCard.fontStyle
        );

        this.items.push(copyCard);

        if(item.value === this.gameResult.value){
            copyCard.pos = 2;
            this.game.uiManager.right++;
            this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
            this.game.uiManager.tweens['ok'].play();
            this.game.uiManager.tweens['ok'].restart();

            setTimeout(() => {
                this.prepareRound()
            }, 1500);

        }else{
            copyCard.pos = 1;
            this.game.uiManager.wrong++;
            this.game.uiManager.tweens['wrong'].play();
            this.game.uiManager.tweens['wrong'].restart();
            this.game.uiManager.sounds['wrong'].play();

            setTimeout(() => {
                copyCard.isShow = false;
            }, 500);


        }


    }
}