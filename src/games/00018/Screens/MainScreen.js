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
        this.heroBg = hero;
        this.game = game;
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.uiRenderer = new UIRenderer();
        this.game.isPaused = false;
        this.bg = bgImg;
        this.cardManager = new CardManager();
        this.game.settings.cellSize = 40;
        this.game.settings.cellScale = 1;
        this.name = 'game';

    }

    initScene(){
        this.setTimer();
        this.prepareRound();


    }

    prepareRound()
    {
        this.items = [];
        this.currentStep = 0;
        this.isAnimation = false;

        this.field = {
            sizeX : 12,
            sizeY : 12,
            items : []
        }

        this.path = {
            items : [],
            userItems : [],
            values : [],
            selection : {x : 30, y : 480}
        };

        this.finish = null;
        this.hero = null;

        if(this.bg){
            let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','bg',0,0,this.width,this.height,' ');
            this.items.push(bg);
        }

        if(this.heroBg){
            let heroBg = new BaseSprite( this.game.settings.path.img + this.heroBg.path,'heroBg','hero',this.heroBg.x,this.heroBg.y,this.heroBg.width,this.heroBg.height,' ');
            this.items.push(heroBg);
        }

        let btn = new BaseSprite(this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn','update',this.game.settings.width - 100,this.game.settings.height - 100,50,49,' ');
        this.items.push(btn);


        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);
        this.makeField();

        this.heroX = this.game.helper.getRandomInt(0,this.field.sizeX - 1);
        this.heroY = this.game.helper.getRandomInt(0,this.field.sizeY - 1);
        this.finishX = this.heroX;

        while (this.heroX === this.finishX){
            this.finishX = this.game.helper.getRandomInt(0,this.field.sizeX - 1);
            this.finishY = this.game.helper.getRandomInt(0,this.field.sizeY - 1);
        }

        this.finish = this.makeCell('finish', 3, this.finishX, this.finishY);
        this.hero = this.makeCell('hero', 1, this.heroX, this.heroY);
        this.hero.isShow = false;

        this.horiz = this.heroX - this.finishX;
        this.vert = this.heroY - this.finishY;

        this.makePath();

    }

    makeField(){
        for (let i = 0; i < this.field.sizeX; i++) {
            for (let j = 0; j < this.field.sizeY; j++) {
                let card = new Card(
                    this.game.settings.path.img + 'games/map/cards.svg',
                    'field-'+i,
                    'field',
                    i*(this.game.settings.cellSize) + 30,
                    j*(this.game.settings.cellSize) + 80,
                    this.game.settings.cellSize,
                    this.game.settings.cellSize,
                    i+j,
                    false,
                    false,
                    5
                );
                card.positionX = i;
                card.positionY = j;
                card.pos = 0;
                this.field.items.push(card);
                this.items.push(card);
            }
        }
    }

    makeCell(name, pos, positionX, positionY){

        let cell = new Card(
            this.game.settings.path.img + 'games/map/cards.svg',
            name,
            pos,
            positionX * (this.game.settings.cellSize) + 30,
            positionY * (this.game.settings.cellSize) + 80,
            this.game.settings.cellSize,
            this.game.settings.cellSize,
            1,
            false,
            false,
            4
        );
        cell.pos = pos;
        cell.positionX = positionX;
        cell.positionY = positionY;
        cell.setScale(this.game.settings.cellScale);
        this.items.push(cell);
        return cell;
    }

    makePath() {

        let horizCard = new Card(
            this.game.settings.path.img + 'games/map/arrows.svg',
            name,
            this.horiz,
            550,
            160,
            60,
            60,
            1,
            false,
            false,
            4
        );

        horizCard.pos = this.horiz < 0 ? 2 : 3;
        horizCard.setScale(this.game.settings.cellScale);
        this.items.push(horizCard);

        let vertCard = new Card(
            this.game.settings.path.img + 'games/map/arrows.svg',
            name,
            this.vert,
            620,
            160,
            60,
            60,
            1,
            false,
            false,
            4
        );

        vertCard.pos = this.vert < 0 ? 0 : 1;
        vertCard.setScale(this.game.settings.cellScale);
        this.items.push(vertCard);

    }


    checkMouseMove(e){

    }



    checkMouseClick(e){

        for(let i=0;i<this.items.length;i++){

            if(this.items[i].type === 'field' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){
                this.items[i].pos = 4;

                if(this.items[i].positionX === this.hero.positionX && this.items[i].positionY === this.hero.positionY){
                    this.items[i].pos = 1;
                    this.game.uiManager.right++;
                    this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                    this.game.uiManager.tweens['ok'].play();
                    this.game.uiManager.tweens['ok'].restart();
                    setTimeout(() => {
                        this.prepareRound();
                    }, 1000);
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

        this.game.ctx.font = "40pt Arial";

        let offsetX = parseInt(this.horiz) > 9 ? 12 : 0;
        let offsetY = parseInt(this.vert) > 9 ? 12 : 0;

        this.game.ctx.fillText(Math.abs(this.horiz).toString() , 565 - offsetX, 150);
        this.game.ctx.fillText(Math.abs(this.vert).toString() , 635 - offsetY, 150);
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