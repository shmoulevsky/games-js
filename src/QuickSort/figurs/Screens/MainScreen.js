import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
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
        this.cardManager = new CardManager();

        this.game.settings.coords = [];

        this.game.settings.coords = [[50,480],[660,480],[355,480]];

    }

    initScene(){
        this.setTimer(); 
        this.prepareRound();
        this.game.isPaused = false;

        window.onkeydown = function(e) {

            

            var pos = 0;

            if(parseInt(e.keyCode) >= 37 && parseInt(e.keyCode) <= 40)
            {

                if(e.keyCode == 37)
                {
                    pos = 0;
                }

                if(e.keyCode == 39)
                {
                    pos = 1;
                }

                if(e.keyCode == 40)
                {
                    pos = 2;
                }

                if(pos == game.settings['curImg']){
                    game.right++;
                    game.points += parseInt((0.5 * game.right) - (0.5 * game.wrong));

                    game.screens[0].tweens['tweenUiOk'].play();
                    game.screens[0].tweens['tweenUiOk'].restart();
                    game.checkResult(true);

                }else{
                    game.wrong++;
                    game.screens[0].tweens['tweenUiWrong'].play();
                    game.screens[0].tweens['tweenUiWrong'].restart();
                    game.checkResult(false);

                }

                game.screens[0].tweens['tweenCardOk'] = TweenMax.to( game.screens[0].items[game.settings['lastImg']], 0.5, { _x : game.settings['coords'][pos][0], _y : game.settings['coords'][pos][1] , repeat: 0, onComplete: game.screens[0].moveNext});

            }
        };

    }



    prepareRound()
    {
        this.items = [];
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


        this.makeCards();

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

    makeCards(){

        for(let i = 0;i < 3;i++)
        {
            let card = new Card(this.game.settings.path.img + 'cards/sort-card-2.svg','sort-' + i,'sort', 0, 0, 180, 180,' ' , false, false, 3);

            card.scale = this.game.settings.scaleImg;
            card.pos = this.game.helper.getRandomInt(0,2);
            card._x = 400 - ((card._width * this.game.settings.scaleImg) / 2);
            card._y = 20*(i*2.5) + 120;

            this.items.push(card);
            this.game.settings.curImg = card.pos;
            this.game.settings.lastImg = this.items.length - 1;
        }




        for(let i = 0;i <= 2;i++)
        {

            let value = i;
            let card = new Card(this.game.settings.path.img + 'cards/sort-card-2.svg','answer-' + i,'answer', this.game.settings.coords[i][0], this.game.settings.coords[i][1],180,180, value, false, false, 3);
            card.scale = 0.5;
            card.pos = value;

            this.items.push(card);
        }

    }

    moveNext(){

        this.items[this.game.settings.countImg + 3].pos = this.helper.getRandomInt(0,2);
        this.helper.arrayMoveTo(this.items, this.game.settings.countImg + 4 - 1, 4);

        for(let i = 0;i < this.game.settings.countImg;i++)
        {
            this.items[i + 4]._x = 400 - ((game.screens[0].items[i + 4]._width *  game.settings['scaleImg']) / 2);
            this.items[i + 4]._y = 20*(i*2.5) + 120;
            this.items[i + 4].isShow = true;
            this.game.settings.curImg = this.items[i + 4].pos;
        }


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

    checkResult(item) {
        //console.log(item.value, this.roundValue);
        if(item.value === this.roundValue && item.canDrag){
            this.currentCount++;
            item.isDraggable = false;
            item.canDrag = false;
            this.game.uiManager.right++;
            this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
            this.game.uiManager.tweens['ok'].play();
            this.game.uiManager.tweens['ok'].restart();

        }

        if(this.roundValueCount === this.currentCount){

            setTimeout(() => {
               this.prepareRound()
            }, 1000);

        }
    }
}