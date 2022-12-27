import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import ScenePositionerHorizontal from './../../../base/Utils/ScenePositionerHorizontal'
import DefaultCard from "../../../base/Cards/DefaultCard";

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
    }

    initScene(){
        this.setTimer(); 
        this.prepareRound();
        this.game.isPaused = false;

    }



    prepareRound()
    {
        this.items = [];
        this.gameResult = 0;
        this.userResult = 0;
        this.digitPosition = 0;
        this.currentDigitPosition = 0;
        this.game.secondsShort = this.game.settings.time.short;

        if(this.bg){
            let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','bg',0,0,this.width,this.height,' ');
            this.items.push(bg);
        }


        
        let btn = new BaseSprite(this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn','update',730,533,50,49,' ');
        this.items.push(btn);

        let basket = new BaseSprite(this.game.settings.path.img + 'cards/denesh/basket.svg',
            'basket-field','basket',489,100,281,100,' ');
        this.items.push(basket);

        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);

        this.count1 = this.game.helper.getRandomInt(1,15);
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

        let colors = ['blue','red','yellow','green'];
        let shape = ['circle','square','triangle','rectangle'];
        let size = ['big','small'];

        this.currentColor = this.game.helper.getRandomInt(0,3);
        this.currentShape = this.game.helper.getRandomInt(0,3);
        this.currentSize = this.game.helper.getRandomInt(0,1);
        this.roundValue = this.currentColor.toString() + this.currentShape.toString() + this.currentSize.toString();

        this.roundValueCount = this.game.helper.getRandomInt(1,5);
        this.currentCount = 0;

        let colorCard = new BaseSprite(
            this.game.settings.path.img + 'cards/denesh/'+colors[this.currentColor]+'.svg','bg','bg',
            30,100,
            120,120,' ');

        let shapeCard = new BaseSprite(
            this.game.settings.path.img + 'cards/denesh/'+shape[this.currentShape]+'.svg','bg','bg',
            120,100,
            120,120,' ');

        let sizeCard = new BaseSprite(
            this.game.settings.path.img + 'cards/denesh/'+size[this.currentSize]+'.svg','bg','bg',
            210,100,
            120,120,' ');

        colorCard.scale = 1;
        shapeCard.scale = 1;
        sizeCard.scale = 1;

        this.items.push(colorCard);
        this.items.push(shapeCard);
        this.items.push(sizeCard);

        let cards = [];

        for (let i = 0; i < 25; i++) {

            let itemColor = this.game.helper.getRandomInt(0,3);
            let itemShape = this.game.helper.getRandomInt(0,3);
            let itemSize = this.game.helper.getRandomInt(0,1);

            if(itemColor.toString()+itemShape.toString()+itemSize.toString() === this.roundValue) continue;

            let name = colors[itemColor]+'-'+shape[itemShape]+'-'+size[itemSize];
            let card = this.cardManager.createCard(
                this.game.settings.path.img + 'cards/denesh/'+name+'.svg',
                'card',
                i,
                120,
                120,
                true,
                1,
                0.85,
                0);

            card._x = this.game.helper.getRandomInt(20,700);
            card._y = this.game.helper.getRandomInt(200,500);
            card.value = itemColor.toString()+itemShape.toString()+itemSize.toString();
            cards.push(card);
        }

        for (let i = 0; i < this.roundValueCount; i++) {

            let name = colors[this.currentColor]+'-'+shape[this.currentShape]+'-'+size[this.currentSize];
            let card = this.cardManager.createCard(
                this.game.settings.path.img + 'cards/denesh/'+name+'.svg',
                'card',
                i,
                120,
                120,
                true,
                1,
                0.85,
                0);

            card._x = this.game.helper.getRandomInt(20,700);
            card._y = this.game.helper.getRandomInt(200,500);
            card.value = this.currentColor.toString()+this.currentShape.toString()+this.currentSize.toString();
            cards.push(card);
        }

        for (const cardsKey in cards) {
            this.items.push(cards[cardsKey]);
        }

        console.log(this.roundValueCount);


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

        this.game.ctx.font = "50pt Arial";
        this.game.ctx.fillStyle = '#ff8000';
        this.game.ctx.fillText((this.roundValueCount - this.currentCount).toString() , 340, 160);
        
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