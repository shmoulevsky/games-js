import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import ScenePositionerHorizontal from "../../../base/Utils/ScenePositionerHorizontal";

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
        this.name = 'game';

    }

    initScene(){
        this.setTimer();
        this.prepareRound();

    }

    prepareRound()
    {
        this.items = [];
        this.basket = [];
        this.right = [];

        this.digits = {
            items : [],
            coords : [
                {x: 35,y: 472},
                {x: 101,y: 461},
                {x: 165,y: 447},
                {x: 234,y: 433},
                {x: 300,y: 420},
                {x: 368,y: 405},
                {x: 434,y: 390},
                {x: 500,y: 377},
                {x: 567,y: 363},
                {x: 634,y: 349}
            ]

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

        let stairs = new Card(this.game.settings.path.img + 'games/order/001/stairs.svg',
            'stairs','stairs',30,425,694,520,' ');


        this.items.push(stairs);

        for (let i = 0; i <= 9; i++) {

            let empty = new Card(
                this.game.settings.path.img + 'games/order/001/empty.svg',
                'empty'+i,
                'empty',
                this.digits.coords[i].x,
                this.digits.coords[i].y,
                64,
                77,
                i,
                false,
                false,
                0
            );

            this.basket.push(empty);
            this.items.push(empty);
        }

        for (let i = 0; i <= 9; i++) {

            let x = this.game.helper.getRandomInt(20, 550);
            let y = this.game.helper.getRandomInt(90, 250);

            let card = new Card(
                this.game.settings.path.img + 'games/order/001/'+i+'.svg',
                'digit-'+i,
                'digit',
                x,
                y,
                55,
                71,
                i,
                false,
                true,
                0
            );


            this.digits.items.push(card);
            this.items.push(card);
            this.right.push(null);
        }

    }




    checkMouseMove(e){

    }


    checkMouseClick(e){

        for(let i=0;i<this.items.length;i++){

            if(this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){
                this.prepareRound();
            }
        }

    }

    checkMouseUp(e){

        for(let i=0;i<this.items.length;i++){
            for(let j=0;j<this.basket.length;j++){
                if(
                    this.items[i].type === 'digit'
                    && this.game.helper.isCursor(e, this.items[i])
                    && this.game.helper.isIntersect(this.items[i], this.basket[j])

                ){
                    this.items[i]._x = this.basket[j]._x;
                    this.items[i]._y = this.basket[j]._y;

                    if(this.items[i].value === this.basket[j].value){
                        this.right[parseInt(this.items[i].value)] = this.items[i].value;
                        this.game.uiManager.right++;
                        this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                    }else{
                        this.game.uiManager.wrong++;
                        this.right[parseInt(this.items[i].value)] = null;
                    }

                }
            }

            if(this.items[i].type === 'empty' && this.game.helper.isCursor(e, this.items[i])){
            console.log(this.items[i]._x, this.items[i]._y);
        }
        }

        this.empties = this.right.length - this.right.filter((item) => item === null ).length;

        if(this.empties === 10){
            setTimeout(() => {
                this.game.showScreen(1,2);
            }, 1500)
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