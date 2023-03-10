import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import Card from "../../../base/Images/Card";
import gsap from "gsap";

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
        this.cardManager = new CardManager();

        this.game.settings.countImg = 4;
        this.game.settings.coords = [];
        this.game.settings.coords = [[50,480],[660,480],[355,480]];
        this.isAnimation = false;
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
            this.game.settings.lastImg = 5;
        }


        for(let i = 0;i <= 2;i++)
        {
            let value = i;
            let card = new Card(this.game.settings.path.img + 'cards/sort-card-2.svg','answer-' + i,'answer', this.game.settings.coords[i][0], this.game.settings.coords[i][1],180,180, value, false, false, 3);
            card.scale = 0.5;
            card.pos = value;
            this.items.push(card);
        }

        console.log(this.items);

    }

    moveNext(scene){

        let indexOffset = 3;
        scene.items[3].pos = scene.game.helper.getRandomInt(0,2); // first
        scene.game.helper.arrayMoveTo(
            scene.items,
            6, // last sort
            3 // first sort
        );

        for(let i = 0;i < this.game.settings.countImg;i++){
            scene.items[i + indexOffset]._x = 400 - ((scene.items[i + indexOffset]._width *  scene.game.settings.scaleImg) / 2);
            scene.items[i + indexOffset]._y = 20*(i*2.5) + 120;
            scene.game.settings.curImg = this.items[5].pos;
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