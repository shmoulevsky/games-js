import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
import Card from "../../../base/Images/Card";
import gsap from "gsap";
import TextCard from "../../../base/Images/TextCard";

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
        this.game.settings.count = 15;


    }

    initScene(){

        this.setTimer();
        this.prepareRound();
        this.game.isPaused = false;

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



        for(let i = 0;i < this.game.settings.count;i++) {
            let card = new TextCard( this.game.settings.path.img + 'cards/fig-'+(i % 3 + 1)+'.svg','fig-' + i, 'fig', 0, 0,70,100, i % 3 + 1, false, true);
            this.items.push(card);
        }

        this.restart();

    }

    restart(){

        for(let i = 0;i < this.items.length;i++)
        {
            if(this.items[i].type === 'fig')
            {
                this.items[i].isShow = true;
                this.items[i]._x = this.game.helper.getRandomInt(50, 750);
                this.items[i]._y = this.game.helper.getRandomInt(390, 500);
            }

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

        for(let i=0;i<this.items.length;i++)
        {
            for(let j=0;j<this.basket.length;j++)
            {
                if(this.items[i].type === 'fig' && this.game.helper.isIntersect(this.items[i],this.basket[j]) && this.items[i].isShow)
                {

                    if(this.items[i].value === this.basket[j].value){

                        this.game.uiManager.right++;
                        this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                        this.game.uiManager.tweens['ok'].play();
                        this.game.uiManager.tweens['ok'].restart();

                        if(parseInt(this.game.uiManager.right) + parseInt(this.game.uiManager.wrong) >= this.game.settings.figCount*3)
                        {
                            this.game.showScreen(1,2);
                            clearInterval(this.game.timerId);
                        }

                    }else{
                        this.game.uiManager.wrong++;
                    }

                    this.items[i].isShow = false;

                }
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