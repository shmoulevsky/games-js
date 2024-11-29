import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import ScenePositionerHorizontal from "../../../base/Utils/ScenePositionerHorizontal";
import {clone} from "lodash";
import Card from "../../../base/Images/Card";
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
        this.game.settings.cellSize = 50;

    }

    initScene(){
        this.isActive = false;
        this.setTimer();
        this.prepareRound();
    }

    prepareRound()
    {
        this.isActive = false;
        this.items = [];
        this.currentStep = 0;
        this.isAnimation = false;

        this.field = {
            sizeX : 6,
            sizeY : 6,
            items : []
        }


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
        this.makeField();

    }

    makeField(){

        this.needPositions = [];
        this.userPositions = [];

        for (let i = 0; i < this.field.sizeX; i++) {
            for (let j = 0; j < this.field.sizeY; j++) {
                let card = new Card(
                    this.game.settings.path.img + 'games/dots/001/cards-0.svg',
                    'field-'+i,
                    'field',
                    i*(this.game.settings.cellSize + 1) + 30,
                    j*(this.game.settings.cellSize + 1) + 150,
                    this.game.settings.cellSize,
                    this.game.settings.cellSize,
                    (i*this.field.sizeX)+j,
                    false,
                    false,
                    3
                );
                this.field.items.push(card);
                this.items.push(card);
            }
        }

        this.count = this.game.helper.getRandomInt(3, 12);

        for (let i = 0; i < this.count; i++) {
            let pos = this.game.helper.getRandomInt(0, this.field.sizeX*this.field.sizeY - 1);
            this.needPositions.push(this.field.items[pos].value);
            this.field.items[pos].pos = 1;
        }

        this.needPositions = [...new Set(this.needPositions)];

        for (let i = 0; i < this.field.sizeX; i++) {
            for (let j = 0; j < this.field.sizeY; j++) {
                let card = new Card(
                    this.game.settings.path.img + 'games/dots/001/cards-0.svg',
                    'user-field-'+i,
                    'user-field',
                    i*(this.game.settings.cellSize + 1) + 430,
                    j*(this.game.settings.cellSize + 1) + 150,
                    this.game.settings.cellSize,
                    this.game.settings.cellSize,
                    (i*this.field.sizeX)+j,
                    false,
                    false,
                    3
                );
                card.positionX = i;
                card.positionY = j;
                this.items.push(card);
            }
        }

        this.isActive = true;

    }

    checkMouseMove(e){

    }


    checkMouseClick(e){

        for(let i=0;i<this.items.length;i++){

            if(this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i])){
                this.prepareRound();
            }

            if(this.items[i].type === 'user-field' &&
                this.isShow === true &&
                this.game.helper.isClick(e, this.items[i])){

                this.items[i].pos = this.items[i].pos === 1 ? 0 : 1;

                if(this.items[i].pos === 1){
                    this.userPositions.push(this.items[i].value);

                    if(!this.needPositions.includes(this.items[i].value)){
                        this.game.uiManager.wrong++;
                    }

                }else{
                    let index = this.userPositions.indexOf(this.items[i].value);
                    if (index !== -1) {
                        this.userPositions.splice(index, 1);
                    }
                }

            }

        }


        if(this.userPositions.sort().toString() === this.needPositions.sort().toString()){
            this.game.uiManager.right++;
            this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));

            setTimeout(() => {
                this.prepareRound();
            }, 1000);

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