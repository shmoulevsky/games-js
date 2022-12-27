import GameScreen from './../base/screens/gameScreen.js'
import BaseSprite from './../base/baseSprite.js'
import Card from './../base/card.js';

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
            
        
    }

    initScene(){

        this.items = [];

        var bg = new BaseSprite( this.game.settings['game_path']['img'] + this.bg,'bg','bg',0,0,this.width,this.height,' ');
        
        var basket = new BaseSprite( this.game.settings['game_path']['img'] + '/cards/orange.svg','basket','basket',200,200, 100, 100,' ');

        this.items.push(bg);
        this.items.push(basket);
        this.setTimer(); 

        for(var i = 0;i < this.game.settings['countImg'];i++)
        {
            var card = new Card(this.game.settings['game_path']['img'] + 'cards/sort-card-2.svg','sort-' + i,'sort', 0, 0, 180, 180,' ' , false, true, 3);
            
            card.setScale(this.game.settings['scaleImg']);
            card.pos = this.game.helper.getRandomInt(0,2);
            card._x = 400 - ((card._width * this.game.settings['scaleImg']) / 2);
            card._y = 20*(i*2.5) + 120;
            
            this.items.push(card);
            
        }
        
    }

    checkMouseClick(e){
				
        for(var i=0;i<this.items.length;i++){
            
            if(this.items[i].type == 'sort' && 
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow && this.items[i].isDraggable){

                    //console.log(this.items[i]);

            }
        }
       
    }

    checkMouseUp(e){
		        
        for(var i=0;i<this.items.length;i++){

            if(this.items[i].type == 'sort' && this.game.helper.isIntersect(this.items[i],this.items[1]) && this.items[i].isDraggable)
            {
                this.items[i].isAnimated = true;
                alert('ok');
            }
        }
       
    }

    // таймер
    setTimer(){
			
        this.game.timerId = setInterval(() => {
          
        this.game.seconds--;
      
        if(this.game.minutes == 0 && this.game.seconds == 0) { 
            this.game.showScreen(0,1); 
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
        this.game.ctx.fillText(this.game.right , 600, 50);
        this.game.ctx.fillText(this.game.wrong , 700, 50);
        this.game.ctx.fillText(this.game.points , 400, 50);
        
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
            
            this.game.ctx.fillText(this.minutes + ':' + this.seconds , 50, 50);
        
    }

}