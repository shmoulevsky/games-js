import UIManager from "./UI/UIManager";

export default class Game{
		
    constructor(width, height, id, helper, uiManager) {
      this.ctx;
      this.settings = [];	
      this.settings['path'] = [];
      this.settings['common_path'] = [];
      
      this.canvas = document.querySelector(id);
      this.ctx = this.canvas.getContext('2d');
      this.ctx.width = width; 
      this.ctx.height = height;
      this.age = 0;
      this.points = 0;
      
      
      this.screens = [];
      this.img = [];
        
      this.isWin = false;  
      this.hours = 0;  
      this.minutes = 0;  
      this.seconds = 0; 
      
      this.settings['minutes'] = 2;
      this.settings['path']['img'] = '';
      this.settings['path']['snd'] = '';
      
      
      this.player = null;
      this.ai = null;
      
      this.timerId = null;
      
      this.offsetX = 0;
      this.offsetY = 0;

      this.helper = helper;
      this.uiManager = uiManager;

    }

    initDrag(){

        this.canvas.onmousedown = (e) => {



            for(var i=0;i<this.screens.length;i++)
             {
                 if(this.screens[i].isShow)
                 {
                     for(var j=this.screens[i].items.length-1;j>=0;j--)
                     {
                         if(this.helper.isCursor(e, this.screens[i].items[j])){
                             this.screens[i].items[j].isDraggable = true;
                             //помещаем вперед
                             //this.screens[i].items.push(this.screens[i].items.splice(j, 1)[0]);
                             break;
                         }
                     }
                     
                     this.screens[i].checkMouseClick(e);
                     
                     
                 }
             }				
            
               
         };
                     
         this.canvas.onmouseup = (e) => {
                                  
            for(var i=0;i<this.screens.length;i++)
             {
                 if(this.screens[i].isShow)
                 {
                     for(var j=0;j<this.screens[i].items.length;j++)
                     {
                         
                         this.screens[i].items[j].isDraggable = false;
                         this.offsetX = 0;
                     }
                     this.screens[i].checkMouseUp(e);
                     
                 }
                 
                 
             }		
                       
                
         };
             
         this.canvas.onmousemove = (e) => {
                
             for(let i=0;i<this.screens.length;i++)
             {
                 if(this.screens[i].isShow)
                 {
                     //this.screens[i].checkMouseMove(e);

                     for(let j=0;j<this.screens[i].items.length;j++)
                     {
                         if(this.screens[i].items[j].isDraggable){
                                 
                             if(this.offsetX <= 0)
                             {
                                 this.offsetX = e.pageX - this.screens[i].items[j]._x;
                                 this.offsetY = e.pageY - this.screens[i].items[j]._y;
                             }
                             
                             this.screens[i].items[j]._x = parseInt(e.pageX - this.offsetX);
                             this.screens[i].items[j]._y = parseInt(e.pageY - this.offsetY);

                         }	 
                     }

                     this.screens[i].checkMouseMove(e);
                 }
             }		
                
                  
               
              
         };
    }
    
    showScreen(old,dest){
        
        this.screens[old].isShow = false;
        this.screens[dest].isShow = true;
        
    }
    
    reset(){
      this.uiManager.right = 0;
      this.uiManager.wrong = 0;
      this.uiManager.points = 0;
      
      this.minutes = this.settings['minutes'];  
      this.seconds = 0; 

      clearInterval(this.timerId);

    }
    
    checkResult(isRight){
        
        if(isRight)
        {
          this.ai.life = this.ai.life - this.player.power; 
          document.getElementById("ai-score").querySelector(".rest").innerHTML = this.ai.life;
          document.getElementById("ai-score").querySelector(".rect-span").style.width = parseInt((100 * this.ai.life) / this.ai.lifeTotal) + '%';
          
      }else{
          this.player.life = this.player.life - this.ai.power; 
          document.getElementById("player-score").querySelector(".rest").innerHTML = this.player.life;
          document.getElementById("player-score").querySelector(".rect-span").style.width = parseInt((100 * this.player.life) / this.player.lifeTotal) + '%';
      }
        
        if(this.player.life <= 0 || this.ai.life <= 0)
        {
          this.showScreen(0,1); 
          clearInterval(this.timerId);
      }
        
        
    }
       
                             
    draw() {

        this.ctx.clearRect(0, 0, 800, 600);

         for(var i=0;i<this.screens.length;i++)
         {
             if(this.screens[i].isShow)
             {
                 for(var j=0;j<this.screens[i].items.length;j++)
                 {
                     if(this.screens[i].items[j].isShow == true)
                     {
                         this.screens[i].items[j].draw(this.ctx);
                         
                     }
                 }
                 this.screens[i].render();
                 
             }
         }			
     
                     
      requestAnimationFrame(() => this.draw());
         
     }
  
  }