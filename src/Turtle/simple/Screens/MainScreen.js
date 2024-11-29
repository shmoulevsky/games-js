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
        this.game.settings.cellSize = 60;

    }

    initScene(){
        this.setTimer();
        this.prepareRound();

        window.onkeydown = (e) => {

            if (e.repeat) { return }

            let dir = -1;

            if(e.key === 'ArrowUp') {
                dir = 0;
            }

            if(e.key === 'ArrowDown') {
                dir = 1;
            }

            if(e.key === 'ArrowLeft') {
                dir = 2;
            }

            if(e.key === 'ArrowRight') {
                dir = 3;
            }

            this.path.items[this.currentStep].pos = dir;
            this.path.items[this.currentStep].value = dir;
            this.currentStep++;

        }

    }

    prepareRound()
    {
        this.items = [];
        this.currentStep = 0;
        this.isAnimation = false;

        this.field = {
            sizeX : 6,
            sizeY : 6,
            items : []
        }

        this.path = {
            items : [],
            userItems : [],
            values : [],
            selection : {x : 30, y : 500}
        };

        this.finish = null;
        this.hero = null;

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
        this.makePath();

        this.heroX = this.game.helper.getRandomInt(0,5);
        this.heroY = this.game.helper.getRandomInt(0,5);
        this.finishX = this.heroX;

        while (this.heroX === this.finishX){
            this.finishX = this.game.helper.getRandomInt(0,5);
            this.finishY = this.game.helper.getRandomInt(0,5);
        }

        this.finish = this.makeCell('finish', 3, this.finishX, this.finishY);
        this.hero = this.makeCell('hero', 1, this.heroX, this.heroY);

    }

    makeField(){
        for (let i = 0; i < this.field.sizeX; i++) {
            for (let j = 0; j < this.field.sizeY; j++) {
                let card = new Card(
                    this.game.settings.path.img + 'games/turtle/cards.svg',
                    'field',
                    'field-'+i,
                    i*(this.game.settings.cellSize + 1) + 30,
                    j*(this.game.settings.cellSize + 1) + 100,
                    this.game.settings.cellSize,
                    this.game.settings.cellSize,
                    i+j,
                    false,
                    false,
                    4
                );
                card.positionX = i;
                card.positionY = j;
                this.field.items.push(card);
                this.items.push(card);
            }
        }
    }

    makeCell(name, pos, positionX, positionY){

        let cell = new Card(
            this.game.settings.path.img + 'games/turtle/cards.svg',
            name,
            pos,
            positionX * (this.game.settings.cellSize + 1) + 30,
            positionY * (this.game.settings.cellSize + 1) + 100,
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
        this.items.push(cell);
        return cell;
    }

    makePath() {

        let scenePositioner = new ScenePositionerHorizontal(430, 100,56,56,4, this.game.scale);

        for (let i = 0; i < 4; i++) {

            let coords = scenePositioner.getCoords(i);
            let card = new Card(
                this.game.settings.path.img + 'games/turtle/arrows.svg',
                'arrow-'+i,
                'arrow',
                coords.x,
                coords.y,
                this.game.settings.cellSize,
                this.game.settings.cellSize,
                i,
                false,
                false,
                5
            );

            card.pos = i;
            card.setScale(0.75*this.game.scale);
            this.items.push(card);
        }

        scenePositioner.init(30, 500,56,56,12, this.game.scale);

        let countUserSteps = 24;

        for (let i = 0; i <countUserSteps; i++) {

            let coords = scenePositioner.getCoords(i);
            let card = new Card(
                this.game.settings.path.img + 'games/turtle/arrows.svg',
                'path-'+i,
                'path',
                coords.x,
                coords.y,
                this.game.settings.cellSize,
                this.game.settings.cellSize,
                '',
                false,
                false,
                6
            );

            card.pos = 4;
            card.setScale(0.75);

            this.path.items.push(card);
            this.items.push(card);

        }

        let card = new Card(
            this.game.settings.path.img + 'games/turtle/arrows.svg',
            'play',
            'play',
            (11*56)+38,
            100,
            this.game.settings.cellSize,
            this.game.settings.cellSize,
            '',
            false,
            false,
            7
        );

        card.pos = 5;
        card.setScale(0.75);
        this.items.push(card);

        let clear = new Card(
            this.game.settings.path.img + 'games/turtle/arrows.svg',
            'clear',
            'clear',
            (12*56)+38,
            100,
            this.game.settings.cellSize,
            this.game.settings.cellSize,
            '',
            false,
            false,
            7
        );

        clear.pos = 6;
        clear.setScale(0.75);
        this.items.push(clear);

    }


    checkMouseMove(e){

    }

    play(item){

        let xSpeed = 0;
        let ySpeed = 0;
        let index = 0;
        let positionX = 0;
        let positionY = 0;

        function handlePath(hero, path, finish, context) {
            if(path[index].value === '') {
                setTimeout(() => {
                    hero._x = (context.heroX * 61) + 30;
                    hero._y = (context.heroY * 61) + 100;
                    hero.positionX = context.heroX;
                    hero.positionY = context.heroY;
                    context.path.selection.x = 30;
                    context.path.selection.y = 500;
                    context.isAnimation = false;
                }, 1000)

                return;
            }

            context.path.selection.x = path[index]._x;
            context.path.selection.y = path[index]._y;

            moveHero(path[index].value, hero, finish, context)


            index++
            if(index < 24) {
                setTimeout(() => {
                    handlePath(hero, path, finish, context);
                }, 500)
            }else{
                context.isAnimation = false;
            }
        }

        function moveHero(direction, hero, finish, context){
            switch (direction){
                case 0 :
                    ySpeed =-61;
                    xSpeed = 0;
                    positionX = 0;
                    positionY =-1;
                    break;
                case 1 :
                    ySpeed = 61;
                    xSpeed = 0;
                    positionX = 0;
                    positionY = 1;
                    break;
                case 2 :
                    xSpeed = -61;
                    ySpeed = 0;
                    positionX = -1;
                    positionY = 0;
                    break;
                case 3 :
                    xSpeed = 61;
                    ySpeed = 0;
                    positionX = 1;
                    positionY = 0;
                    break;
                case '' :  break;
            }

            if((hero.positionX>0 || direction === 3) && (hero.positionX<5 || direction === 2)){
                hero.positionX += positionX;
                hero._x += xSpeed;
            }

            if((hero.positionY>0 || direction === 1) && (hero.positionY<5 || direction === 0)){
                hero.positionY += positionY;
                hero._y += ySpeed;
            }


            if(hero.positionX === finish.positionX && hero.positionY === finish.positionY){
                context.game.uiManager.right++;
                context.game.uiManager.points = parseInt((1.5 * context.game.uiManager.right) - (1.5 * context.game.uiManager.wrong));
                context.game.uiManager.tweens['ok'].play();
                context.game.uiManager.tweens['ok'].restart();

                setTimeout(() => {
                    context.prepareRound();
                }, 900)

            }

        }

        handlePath(this.hero, this.path.items, this.finish, this);

    }

    checkMouseClick(e){

        for(let i=0;i<this.items.length;i++){

            if(this.items[i].type === 'play' && this.game.helper.isClick(e, this.items[i]) && this.isAnimation === false){
                this.isAnimation = true;
                this.play(this.items[i]);
            }

            if(this.items[i].type === 'clear' && this.game.helper.isClick(e, this.items[i]) && this.isAnimation === false){
                for (let key in this.path.items) {
                    this.path.items[key].pos = 4;
                    this.path.items[key].value = '';
                    this.path.selection.x = 30;
                    this.path.selection.y = 500;
                }
                this.currentStep = 0;
            }

            if(this.items[i].type === 'arrow' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){

                this.path.items[this.currentStep].pos = this.items[i].pos;
                this.path.items[this.currentStep].value = this.items[i].value;
                this.currentStep++;

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

        this.game.ctx.lineWidth = "2";
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.strokeRect(this.path.selection.x, this.path.selection.y, 45, 45)

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