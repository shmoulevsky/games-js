import GameScreen from '../../../base/Screens/GameScreen'
import BaseSprite from '../../../base/Images/BaseSprite'
import CardManager from '../../../base/Manager/CardManager'
import TextCardManager from '../../../base/Manager/TextCardManager'
import ScenePositionerVertical from '../../../base/Utils/ScenePositionerVertical'
import ScenePositionerHorizontal from '../../../base/Utils/ScenePositionerHorizontal'


// основной класс игры
export default class MainScreen extends GameScreen{
		
    constructor(bgImg, game, width = 800, height = 600){
        super();
        
        
        this.basket = [];
        this.width = width;
        this.height = height;
        this.game = game;
        this.game.minutes = game.settings['minutes'];
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();    
        
    }

    initScene(){

        this.initSounds(); 
        this.setTimer(); 
        this.prepareRound();
        
        
    }

    initSounds(){

        for (let i = 0; i <= 12; i++) {
            this.sounds['digit-' + i] =  new Audio(this.game.settings['path']['snd'] + i + ".mp3");
        }

    }

    prepareRound()
    {
        this.items = [];
        let bg = new BaseSprite( this.game.settings['path']['img'] + this.bg,'bg','bg',0,0,this.width,this.height,' ');
        
        let btn = new BaseSprite(this.game.settings['path']['img'] + 'ui/update-btn.svg','update-btn','update',480,510,191,49,' ');
 
        this.items.push(bg);
        this.items.push(btn);
        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);

        this.count = this.game.helper.getRandomInt(1,12);
        this.makeRows();
        this.makeDigits();  
    }

    makeRows()
    {
        
        //let startX = 260; 
        let startX = 160; 
        let startY = 90;
        let offsetX = 100
        let offsetY = 100
        let countInRow = 5;

        let scenePositioner = new ScenePositionerVertical(
            startX, 
            startY,
            offsetX,
            offsetY,
            countInRow
        );

        let path = this.game.settings['path']['img'] + 'cards/sort-card-2.svg';
        let tag = 'sort' 
        let width = 180;
        let height = 180;
        let isDraggable = false;
        let numFrames = 3; 
        let scale =  this.game.settings['scaleImg'];
        

        for(let i = 0; i < this.count;i++)
        {
            let coords = scenePositioner.getCoords(i);
            let pos = this.game.helper.getRandomInt(0, numFrames - 1);
            let card = this.cardManager.createCard(path, tag, i, width, height, isDraggable, numFrames, scale, pos);
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
        let offsetY = 80;
        let countInRow = 6;

        let scenePositioner = new ScenePositionerVertical(
            startX, 
            startY,
            offsetX,
            offsetY,
            countInRow
        );

        let tag = 'digit' 
        let width = 70;
        let height = 70;
        let isDraggable = false; 
        let canDrag = false; 
        let count = 12;
        let canvasId = 'card-canvas';

        let fontStyle = {};
        fontStyle.size = '40';
        fontStyle.font = 'Arial';
        fontStyle.color1 = 'black';
        fontStyle.color2 = 'red';
        fontStyle.x = 30;
        fontStyle.xoffset = 10;
        fontStyle.y = 50;

        let cardBg = new Image();
		cardBg.src = this.game.settings['path']['img']+'/cards/card.svg';

        cardBg.onload = () => {
			
            for(let i = 0; i < count;i++)
            {
            
                let coords = scenePositioner.getCoords(i);
                let card = this.textCardManager.createCard(cardBg, canvasId, tag, i, i + 1, 0, 0, width, height, isDraggable, canDrag, fontStyle);
                card._x = coords.x;
                card._y = coords.y;
                card.value = parseInt(i+1);
                this.items.push(card);
            
            }
            
        }

    }

    
    checkMouseClick(e){
				
        for(let i=0;i<this.items.length;i++){
            
            if(this.items[i].type === 'digit' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){
                    
                    if(this.items[i].value <= 12) {
                        this.sounds['digit-' + this.items[i].value].play();
                    }
                    
                    if(this.items[i].value === this.count){
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
                        this.game.uiManager.sounds['wrong'].play();
                       
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
		        
        for(var i=0;i<this.items.length;i++){

            if(this.items[i].type === 'sort' && this.game.helper.isIntersect(this.items[i],this.items[1]) && this.items[i].isDraggable)
            {
                this.items[i].isAnimated = true;
                
            }
        }
       
    }

    // таймер
    setTimer(){
		
        clearInterval(this.game.timerId);
        
        this.game.timerId = setInterval(() => {
          
        this.game.seconds--;
      
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