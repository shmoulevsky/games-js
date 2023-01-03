import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import DefaultCard from "../../../base/Cards/DefaultCard";
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
        this.game.settings.digitsRow = 8;
        this.game.settings.digitsCount = Math.pow(this.game.settings.digitsRow, 2);
        this.game.settings.currentDigit = 0;
    }

    initScene(){

        this.setTimer();
        this.prepareRound();
        this.game.isPaused = false;
    }

    restart(){

    }

    prepareRound()
    {
        this.items = [];

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
    }

    makeCards(){

        let cardBg = new Image();
        cardBg.src = this.game.settings.path.img + 'cards/card.svg';

        this.game.arDigits = [];

        for(let i=0;i<this.game.settings.digitsCount;i++) {
            this.game.arDigits.push(i);
        }

        this.game.helper.shuffle(this.game.arDigits);


        let cardWidth = 61;
        let cardHeight = 61;

        let fontStyle = {};
        fontStyle.size = '40';
        fontStyle.font = 'Calibri';
        fontStyle.color1 = 'black';
        fontStyle.color2 = 'red';
        fontStyle.x = 20;
        fontStyle.xoffset = 10;
        fontStyle.y = 40;
        let count = 0;

        cardBg.onload = () => {

            for(let i=0;i<Math.sqrt(this.game.settings.digitsCount);i++){
                for(let j=0;j<Math.sqrt(this.game.settings.digitsCount);j++){

                    let card = new TextCard('', 'card-' + count,'card',
                        j * (cardWidth - 1) + 60 ,
                        i * (cardHeight - 1) + 100,
                        cardWidth,
                        cardHeight,
                        this.game.arDigits[count],
                        false,
                        false,
                        'card-canvas',
                        cardBg, 2, fontStyle);

                    this.items.push(card);
                    count++;
                }
            }
        }

    }

    checkMouseMove(e){

    }

    checkMouseClick(e){

        for(let i=0; i < this.items.length;i++) {

            if(this.items[i].type === 'card' && this.game.helper.isClick(e, this.items[i]) && this.items[i].isShow)
            {
                console.log(this.items[i].value, this.items[i].name, this.game.settings.currentDigit);

                if(this.items[i].value === this.game.settings.currentDigit){

                    this.game.uiManager.right++;
                    this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
                    this.game.settings.currentDigit++;
                    this.items[i].pos = 1;
                    this.game.uiManager.tweens['ok'].play();
                    this.game.uiManager.tweens['ok'].restart();

                    if(this.game.settings.currentDigit >= this.game.settings.digitsCount)
                    {
                        this.game.showScreen(0,1);
                        clearInterval(this.game.timerId);
                    }

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