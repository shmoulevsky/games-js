import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import ScenePositionerHorizontal from "../../../base/Utils/ScenePositionerHorizontal";
import {clone} from "lodash";
import Card from "../../../base/Images/Card";

// основной класс игры
export default class MainScreen extends GameScreen{
		
    constructor(bgImg, game, width = 800, height = 600){
        super();
        this.basket = [];
        this.width = width;
        this.height = height;
        this.game = game;
        this.game.isPaused = false;
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();
        this.defaultCard = new DefaultCard();
        this.cardManager = new CardManager();

        this.game.settings.fieldSize = 6;
        this.game.settings.secondsLeft = 10;

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

        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);
        this.makeCards();


    }

    makeCards() {

        this.count = Math.pow(this.game.settings.fieldSize, 2);
        this.pairCount = 5;
        this.cards = [];
        this.field = [];
        this.heroPath = [];
        this.selectedItems = [];

        for (let i = 0; i < this.count; i++) {
            if (i >= this.pairCount) {
                this.field.push(0);
            } else {
                this.field.push(2);
            }

        }

        this.field = this.game.helper.shuffle(this.field);

        let startX = 30;
        let startY = 80;
        let offsetX = 61;
        let offsetY = 61;
        let countInRow = this.game.settings.fieldSize;

        let scenePositioner = new ScenePositionerHorizontal(
            startX,
            startY,
            offsetX,
            offsetY,
            countInRow
        );

        for (let i = 0; i < this.count; i++) {

                let coords = scenePositioner.getCoords(i);

                let card = new Card(
                    this.game.settings.path.img + 'games/turtle/cards.svg',
                    'field',
                    'field-'+i,
                    coords.x,
                    coords.y,
                    60,
                    60,
                    this.field[i],
                    false,
                    false,
                    4
                    );

                card.pos = this.field[i];

                if(this.field[i] === 1){
                    this.hero = card;
                }

                this.items.push(card);
        }

        let finish = new Card(
            this.game.settings.path.img + 'games/turtle/cards.svg',
            'finish',
            'finish',
            30+(5*61),
            80+(5*61),
            60,
            60,
            1,
            false,
            false,
            4
        );
        finish.pos = 3;
        this.finish = finish;
        this.items.push(finish);

        let hero = new Card(
            this.game.settings.path.img + 'games/turtle/cards.svg',
            'hero',
            'hero',
            30,
            80,
            60,
            60,
            1,
            false,
            false,
            4
        );
        hero.pos = 1;
        hero.positionX = 0;
        hero.positionY = 0;

        this.hero = hero;
        this.items.push(hero);


        scenePositioner.init(30, 476,56,56,4);

        for (let i = 0; i < 4; i++) {

            let coords = scenePositioner.getCoords(i);
            let card = new Card(
                this.game.settings.path.img + 'games/turtle/arrows.svg',
                'arrow-'+i,
                'arrow',
                coords.x,
                coords.y,
                60,
                60,
                i,
                false,
                true,
                5
            );

            card.pos = i;
            card.isCopy = false;
            card.setScale(0.75);
            this.items.push(card);
        }

        scenePositioner.init(30, 532,56,56,24);
        this.path = [];

        let countUserSteps = 12;

        for (let i = 0; i <= countUserSteps; i++) {

            let coords = scenePositioner.getCoords(i);
            let card = new Card(
                this.game.settings.path.img + 'games/turtle/arrows.svg',
                'path-'+i,
                'path',
                coords.x,
                coords.y,
                60,
                60,
                i,
                false,
                false,
                6
            );

            card.pos = 4;
            card.setScale(0.75);

            if(i === countUserSteps){
                card.pos = 5;
                card.type = 'play';
            }

            this.path.push(card);
            this.items.push(card);
            this.heroPath.push('');
        }




    }


    checkMouseMove(e){

    }

    play(item){

        let xSpeed = 0;
        let ySpeed = 0;
        let index = 0;
        let positionX = 0;
        let positionY = 0;

        function handlePath(hero, path) {
            if(path[index] === '') {
                setTimeout(() => {
                    hero._x = 30;
                    hero._y = 80;
                    hero.positionX = 0;
                    hero.positionY = 0;
                }, 1000)

                return;
            }

            moveHero(path[index], hero)
            index++
            if(index < 15) {
                setTimeout(() => {
                    handlePath(hero, path);
                }, 500)
            }
        }

        function moveHero(direction, hero){

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

            hero.positionX += positionX;
            hero.positionY += positionY;

            console.log(hero.positionX, hero.positionY);

            hero._x += xSpeed;
            hero._y += ySpeed;

        }

        handlePath(this.hero, this.heroPath);

    }

    checkMouseClick(e){

        for(let i=0;i<this.items.length;i++){

            if(this.items[i].type === 'play' && this.game.helper.isClick(e, this.items[i])){
                this.play(this.items[i]);
            }

            if(this.items[i].type === 'arrow' &&
                this.items[i].isCopy === false &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){

                setTimeout(() => {
                    let card = new Card(
                        this.game.settings.path.img + 'games/turtle/arrows.svg',
                        'arrow',
                        'arrow',
                        this.items[i]._x,
                        this.items[i]._y,
                        60,
                        60,
                        this.items[i].value,
                        false,
                        true,
                        6
                    );

                    card.pos = this.items[i].pos;
                    card.setScale(0.75);
                    card.isCopy = false;
                    this.items.push(card);
                }, 20);



            }

            if(this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){
                this.prepareRound();

            }
        }

    }

    checkMouseUp(e){

        for(let i=0;i<this.items.length;i++){
            if(this.items[i].type === 'arrow'){
                for (let key in this.path) {
                    if(this.game.helper.isIntersect(this.items[i],this.path[key])){
                        this.items[i]._x = this.path[key]._x;
                        this.items[i]._y = this.path[key]._y;
                        this.heroPath[key] = this.items[i].value;
                        this.items[i].isCopy = true;
                    }

                    if(this.game.helper.isClick(e, this.items[i])){
                        this.items[i].isCopy = true;
                    }

                }
            }
        }

        console.log(this.heroPath);

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
}