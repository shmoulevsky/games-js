import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import ScenePositionerHorizontal from "../../../base/Utils/ScenePositionerHorizontal";
import {clone} from "lodash";
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
        this.game.isPaused = false;
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();
        this.defaultCard = new DefaultCard();
        this.cardManager = new CardManager();

        this.game.settings.fieldSize = 4;
        this.game.settings.secondsLeft = 10;
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

    makeCards() {

        this.count = Math.pow(this.game.settings.fieldSize, 2);
        this.pairCount = this.count / 2;
        this.pairRightCount = 0;
        this.cards = [];
        this.field = [];
        this.selectedItems = [];

        for (let i = 0; i < this.count; i++) {
            if (i < this.pairCount) {
                this.field.push(i);
            } else {
                this.field.push(i - this.pairCount);
            }

        }

        this.field = this.game.helper.shuffle(this.field);

        let startX = 120;
        let startY = 120;
        let offsetX = 80;
        let offsetY = 80;
        let countInRow = this.game.settings.fieldSize;

        let scenePositioner = new ScenePositionerHorizontal(
            startX,
            startY,
            offsetX,
            offsetY,
            countInRow,
            this.game.scale
        );


        this.defaultCard.cardBg = new Image();
        this.defaultCard.cardBg.src = this.game.settings.path.img + '/cards/card.svg';

        this.defaultCard.cardBg.onload = () => {
            for (let i = 0; i < this.count; i++) {

                let coords = scenePositioner.getCoords(i);

                let card = this.textCardManager.createCard(
                    this.defaultCard.cardBg,
                    this.defaultCard.canvasId,
                    'card',
                    i,
                    this.field[i],
                    coords.x,
                    coords.y,
                    this.defaultCard.width,
                    this.defaultCard.height,
                    this.defaultCard.isDraggable,
                    this.defaultCard.canDrag,
                    this.defaultCard.fontStyle
                );

                card.setScale(this.game.scale)
                this.cards.push(card);
                this.items.push(card);


            }

            setTimeout(() => {
                this.hideCards(scenePositioner);
            }, 1000 * this.game.settings.secondsLeft);


        }
    }

    hideCards(scenePositioner){

        scenePositioner.init(
            120,
            120,
            80,
            80,
            this.game.settings.fieldSize,
            this.game.scale
        );

        for (let i = 0; i < this.count; i++) {
            let coords = scenePositioner.getCoords(i);

            let card = this.textCardManager.createCard(
                this.defaultCard.cardBg,
                this.defaultCard.canvasId,
                'hide-card',
                i,
                '?',
                coords.x,
                coords.y,
                this.defaultCard.width,
                this.defaultCard.height,
                this.defaultCard.isDraggable,
                this.defaultCard.canDrag,
                this.defaultCard.fontStyle
            );
            card.setScale(this.game.scale)
            card.realValue = this.field[i];
            this.items.push(card);
        }
    }

    checkMouseMove(e){

    }

    checkMouseClick(e){

        if(this.game.settings.hide_cards === false) return;

        for(let i=0;i<this.items.length;i++)
        {
            if(this.items[i].type === 'hide-card' && this.game.helper.isClick(e, this.items[i]) && this.items[i].isShow)
            {
                this.items[i].isShow = false;
                this.selectedItems.push(this.items[i]);
                if(this.selectedItems.length >= 2){
                    if(this.selectedItems[0].realValue !== this.selectedItems[1].realValue){
                        setTimeout(() => {
                            this.game.uiManager.wrong++;
                            for (const key in this.selectedItems) {
                                this.selectedItems[key].isShow = true;
                            }
                            this.selectedItems.length = 0;
                        }, 1000);

                    }else{
                        for (const key in this.selectedItems) {
                            this.selectedItems[key].pos = 2;
                        }
                        this.selectedItems.length = 0;
                        this.pairRightCount++;
                        this.game.uiManager.right++;
                        this.currentResultCount++;
                        this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                        this.game.uiManager.tweens['ok'].play();
                        this.game.uiManager.tweens['ok'].restart();

                        if(this.pairRightCount === this.pairCount){
                            setTimeout(() => {
                                this.prepareRound()
                            }, 1000);
                        }
                    }
                }

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


        if(this.game.settings.seconds_left > 0 ) {
            this.game.settings.seconds_left--;
        }else if(!this.game.settings.timer_stop){
            this.game.settings.hide_cards = true;
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