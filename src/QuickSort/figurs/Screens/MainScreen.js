import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import Card from "../../../base/Images/Card";
import gsap from "gsap";
import UIRenderer from "../../../base/UI/UIRenderer";

// основной класс игры
export class MainScreen extends GameScreen{
		
    constructor(bgImg, game, hero){
        super();
        this.basket = [];
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.game = game;
        this.hero = hero;
        this.game.isPaused = true;
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();
        this.defaultCard = new DefaultCard();
        this.cardManager = new CardManager();
        this.uiRenderer = new UIRenderer();

        this.game.settings.countImg = 4;
        this.game.settings.coords = [];
        this.game.settings.coords = [[50,480],[660,480],[355,480]];
        this.isAnimation = false;
        this.name = 'game';
    }

    initScene(){

        this.setTimer();
        this.prepareRound();
        this.game.isPaused = false;

        window.onkeydown = (e) => {

            if (e.repeat) { return }
            if(this.isAnimation) return;

            let pos = 2;
            this.isAnimation = true;

            if(e.key === 'ArrowLeft') {
                pos = 0;
            }

            if(e.key === 'ArrowRight') {
                pos = 1;
            }

            if(e.key === 'ArrowDown') {
                pos = 2;
            }

            if(pos === this.game.settings.curImg){
                this.checkResult(true);
            }else{
                this.checkResult(false);
            }

            gsap.to( this.items[this.game.settings['lastImg']], 0.5,
                { _x : this.game.settings['coords'][pos][0],
                    _y : this.game.settings['coords'][pos][1] ,
                    repeat: 0,
                    onComplete: this.moveNext(this)
                });


        };

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

        for(let i = 0;i < this.game.settings.countImg;i++)
        {
            let card = new Card(this.game.settings.path.img + 'cards/sort-card-2.svg','sort-' + i,'sort', 0, 0, 180, 180,' ' , false, false, 3);

            card.scale = this.game.settings.scaleImg;
            card.pos = this.game.helper.getRandomInt(0,2);
            card._x = 400 - ((card._width * this.game.settings.scaleImg) / 2);
            card._y = 20*(i*2.5) + 120;

            this.items.push(card);
            this.game.settings.curImg = card.pos;
            this.game.settings.lastImg = 7;
        }


        for(let i = 0;i <= 2;i++)
        {
            let value = i;
            let card = new Card(this.game.settings.path.img + 'cards/sort-card-2.svg','answer-' + i,'answer', this.game.settings.coords[i][0], this.game.settings.coords[i][1],180,180, value, false, false, 3);
            card.pos = value;
            card.setScale(this.game.scale * 0.5)
            this.items.push(card);
        }



    }

    moveNext(scene){

        let indexOffset = 5;
        scene.items[5].pos = scene.game.helper.getRandomInt(0,2); // first
        scene.game.helper.arrayMoveTo(
            scene.items,
            8, // last sort
            5 // first sort
        );

        for(let i = 0;i < this.game.settings.countImg;i++){
            scene.items[i + indexOffset]._x = 400 - ((scene.items[i + indexOffset]._width *  scene.game.settings.scaleImg) / 2);
            scene.items[i + indexOffset]._y = 20*(i*2.5) + 120;
            scene.game.settings.curImg = this.items[7].pos;
        }

        scene.isAnimation = false;

    }

    checkMouseMove(e){

    }
    
    checkMouseClick(e){
				
        for(let i=0;i<this.items.length;i++){
            
            if(this.items[i].type === 'card' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
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
            null
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

    checkResult(result) {

        if(result){
            this.game.uiManager.right++;
            this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
            this.game.uiManager.tweens['ok'].play();
            this.game.uiManager.tweens['ok'].restart();

        }else{
            this.game.uiManager.wrong++;
            this.game.uiManager.tweens['wrong'].play();
            this.game.uiManager.tweens['wrong'].restart();
        }


    }
}