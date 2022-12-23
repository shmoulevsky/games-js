export default class BaseSprite extends Image{
	
    constructor(img, name, type, x , y , width, height, value, numFrames = 1) {
      super();
      this.name = name;
      this.type = type;
      this.value = value;
      this.src = img;
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      
      this._iwidth = width;
      this._iheight = height;
      
      this.isShow = true;
      // sprite start frame
      this.pos = 0;
      // total sprite frame count
      this.numFrames = numFrames;
      this.isAnimated = false;
      this.animationSpeed= 1;
      this.animationLoop = 0;
      this.isSelected = false;
      this.scale = 1;
    }
    
    draw(ctx, isAnimated = false){
        
         ctx.drawImage(this, 0 + (this.pos * this._width), 0, this._width, this._height, this._x, this._y, this._width * this.scale, this._height * this.scale);

         if(this.isSelected){
             ctx.strokeRect(this._x, this._y, this._width * this.scale, this._height * this.scale);
         }

         if(this.isAnimated && this.animationLoop % this.animationSpeed == 0) {
           this.pos++;
           if(this.pos >= this.numFrames) {
              this.pos = 0;
              this.animationLoop = 0;
          }

       }
       this.animationLoop++;
         
    }

    
  }