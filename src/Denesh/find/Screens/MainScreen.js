import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import TextCardManager from './../../../base/Manager/TextCardManager'
import ScenePositionerHorizontal from './../../../base/Utils/ScenePositionerHorizontal'
import DefaultCard from "../../../base/Cards/DefaultCard";
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
        this.uiRenderer = new UIRenderer();
        this.defaultCard = new DefaultCard();
        this.cardManager = new CardManager();
    }

    initScene(){
        this.setTimer(); 
        this.prepareRound();
        this.game.isPaused = false;

        window.addEventListener("keydown", (e) => {
            let num = parseInt(e.key) || 0;
            this.checkKeyDown(num);
        })

    }



    prepareRound()
    {
        this.items = [];
        this.gameResult = 0;
        this.userResult = 0;
        this.digitPosition = 0;
        this.currentDigitPosition = 0;
        this.game.secondsShort = this.game.settings.time.short * 10;

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
                //this.game.uiManager.sounds['wrong'].play();

                setTimeout(() => {
                    this.prepareRound();
                    this.game.isPaused = false;
                }, 200);
            }


        }, 100);

        for(let i=0;i<this.items.length;i++) {
            this.items[i].setScale(this.game.scale);
        }

    }

    makeCards(){

        let colors = ['blue','red','yellow','green'];
        let shape = ['circle','square','triangle','rectangle'];
        let size = ['big','small'];

        this.currentColor = this.game.helper.getRandomInt(0,3);
        this.currentShape = this.game.helper.getRandomInt(0,3);
        this.currentSize = this.game.helper.getRandomInt(0,1);
        this.roundValue = this.currentColor.toString() + this.currentShape.toString() + this.currentSize.toString();

        let colorCard = new BaseSprite(
            this.game.settings.path.img + 'cards/denesh/'+colors[this.currentColor]+'.svg','bg','bg',
            30,100,
            120,120,' ');

        let shapeCard = new BaseSprite(
            this.game.settings.path.img + 'cards/denesh/'+shape[this.currentShape]+'.svg','bg','bg',
            130,100,
            120,120,' ');

        let sizeCard = new BaseSprite(
            this.game.settings.path.img + 'cards/denesh/'+size[this.currentSize]+'.svg','bg','bg',
            230,100,
            120,120,' ');

        colorCard.setScale(this.game.scale)
        shapeCard.setScale(this.game.scale)
        sizeCard.setScale(this.game.scale)

        this.items.push(colorCard);
        this.items.push(shapeCard);
        this.items.push(sizeCard);

        let startX = 20;
        let startY = 220;
        let offsetX = 90;
        let offsetY = 90;
        let countInRow = 8;

        let scenePositioner = new ScenePositionerHorizontal(
            startX,
            startY,
            offsetX,
            offsetY,
            countInRow,
            this.game.scale
        );

        let i = 0;

        for(let keyColor in colors){
            for(let keyShape in shape){
                for(let keySize in size){
                    let name = colors[keyColor]+'-'+shape[keyShape]+'-'+size[keySize];

                    let coords = scenePositioner.getCoords(i);

                    let card = this.cardManager.createCard(
                        this.game.settings.path.img + 'cards/denesh/'+name+'.svg',
                        'card',
                        i,
                        120,
                        120,
                        false,
                        1,
                        0.85,
                        0);

                    card._x = coords.x;
                    card._y = coords.y;
                    card.value = keyColor+keyShape+keySize;
                    card.setScale(this.game.scale)
                    this.items.push(card);
                    i++;
                }
            }
        }
        

    }

    checkMouseMove(e){

    }

    checkKeyDown(key){
        this.checkResult(key);
    }
    
    checkMouseClick(e){
				
        for(let i=0;i<this.items.length;i++){
            
            if(this.items[i].type === 'card' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
                this.checkResult(this.items[i].value);
                this.items[i].isSelected = true;
            }

            if(this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
                    this.prepareRound();

            }
        }
       
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

    checkResult(value) {

        if(value === this.roundValue){
            this.game.uiManager.right++;
            this.game.uiManager.points = parseInt((1.5 * this.game.uiManager.right) - (1.5 * this.game.uiManager.wrong));
            this.game.uiManager.tweens['ok'].play();
            this.game.uiManager.tweens['ok'].restart();

            setTimeout(() => {
                this.prepareRound()
            }, 1000);

        }else{

            this.game.uiManager.wrong++;
            this.game.uiManager.tweens['wrong'].play();
            this.game.uiManager.tweens['wrong'].restart();
            //this.game.uiManager.sounds['wrong'].play();

            setTimeout(() => {
                this.prepareRound()
            }, 1000);


        }


    }
}