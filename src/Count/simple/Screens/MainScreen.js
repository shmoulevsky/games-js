import GameScreen from "../../../base/Screens/GameScreen";
import ScenePositionerHorizontal from "../../../base/Utils/ScenePositionerHorizontal";
import ScenePositionerVertical from "../../../base/Utils/ScenePositionerVertical";
import CardManager from "../../../base/Manager/CardManager";
import BaseSprite from "../../../base/Images/BaseSprite";
import TextCard from "../../../base/Images/TextCard";
import DefaultCard from "../../../base/Cards/DefaultCard";
import UIRenderer from "../../../base/UI/UIRenderer";

export class MainScreen extends GameScreen{

    constructor(bgImg, game, hero){
        super();


        this.basket = [];
        this.hero = hero;
        this.game = game;
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.uiRenderer = new UIRenderer();
        this.game = game;
        this.bg = bgImg;
        this.cardManager = new CardManager();
        this.defaultCard = new DefaultCard();

    }

    initScene(){

        this.initSounds();
        this.setTimer();
        this.prepareRound();


    }

    initSounds(){

        for (let i = 0; i <= 12; i++) {
            //this.sounds['digit-' + i] =  new Audio("/assets/snd/" + i + ".mp3");
        }

    }

    prepareRound()
    {
        this.items = [];
        this.game.secondsShort = this.game.settings.time.short *10;

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

        this.count = this.game.helper.getRandomInt(1,30);
        this.makeRows();
        this.makeDigits();
    }

    makeRows()
    {

        let startX = 120;
        let startY = 90;
        let offsetX = 90
        let offsetY = 90
        let countInRow = 5;

        let scenePositioner = new ScenePositionerVertical(
            startX,
            startY,
            offsetX,
            offsetY,
            countInRow
        );

        let path = this.game.settings.path.img+ 'cards/sort-card-2.svg';
        let tag = 'sort'
        let width = 180;
        let height = 180;
        let isDraggable = false;
        let numFrames = 3;
        let scale =  this.game.settings.scaleImg;

        this.currentColor = this.game.helper.getRandomInt(0, 2);
        this.currentCount = this.game.helper.getRandomInt(1, 12);

        if (this.count < this.currentCount){ this.count = this.currentCount;}

        let arCards = [];
        let variants = [0, 1, 2];
        variants = variants.filter((item) => { return item !==  this.currentColor});

        for (let i = 0; i < this.currentCount; i++) {
            arCards.push(this.currentColor);
        }

        for (let i = this.currentCount; i < this.count; i++) {
            let index = this.game.helper.getRandomInt(0, 1)
            arCards.push(variants[index]);
        }

        arCards = this.game.helper.shuffle(arCards);
        let card = this.cardManager.createCard(path, tag, 0, width, height, isDraggable, numFrames, scale, this.currentColor);
        card._x = 150;
        card._y = 25;
        card.setScale(0.2*this.game.scale);
        this.items.push(card);

        for(let i = 0; i < this.count;i++)
        {
            let coords = scenePositioner.getCoords(i);
            let pos = arCards[i];
            let card = this.cardManager.createCard(path, tag, i, width, height, isDraggable, numFrames, scale, pos);
            card.setScale(0.45**this.game.scale);
            card._x = coords.x;
            card._y = coords.y;
            this.items.push(card);

        }
    }

    makeDigits()
    {

        let startX = 30;
        let startY = 90;
        let offsetX = 670;
        let offsetY = 65;
        let countInRow = 6;

        let scenePositioner = new ScenePositionerVertical(
            startX,
            startY,
            offsetX,
            offsetY,
            countInRow,
            this.game.scale
        );

        let count = 12;

        let cardBg = new Image();
        cardBg.src = this.game.settings.path.img + 'cards/card.svg';

        cardBg.onload = () => {
            for(let i = 0; i < count;i++) {
                let coords = scenePositioner.getCoords(i);
                let card = new TextCard(
                    '',
                    'digit-' + i,
                    'digit',
                    coords.x,
                    coords.y,
                    61,
                    61,
                    i+1,
                    false,
                    false,
                    'card-canvas',
                    cardBg,
                    2,
                    this.defaultCard.fontStyle
                );

                this.items.push(card);

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
                    //this.game.uiManager.sounds['wrong'].play();

                    setTimeout(() => {
                        this.prepareRound();
                        this.game.isPaused = false;
                    }, 200);
                }


            }, 100);

        }


    }


    checkMouseClick(e){

        for(let i=0;i<this.items.length;i++){

            if(this.items[i].type === 'digit' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){

                if(this.items[i].value <= 12) {
                    //this.sounds['digit-' + this.items[i].value].play();
                }

                if(this.items[i].value === this.currentCount){
                    this.game.uiManager.right++;
                    this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                    this.game.uiManager.tweens['ok'].play();
                    this.game.uiManager.tweens['ok'].restart();

                    this.prepareRound();
                    e.preventDefault();
                    return;

                }else{
                    this.game.uiManager.wrong++;
                    this.game.uiManager.tweens['wrong'].play();
                    this.game.uiManager.tweens['wrong'].restart();


                }

            }

            if(this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){
                this.prepareRound();
            }
        }

    }

    checkMouseMove(e){

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