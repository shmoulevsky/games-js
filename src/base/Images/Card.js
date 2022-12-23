import BaseSprite from './BaseSprite';

export default class Card extends BaseSprite{
	
    constructor(img, name, type, x , y , width, height, value, isDraggable, canDrag , numFrames = 1) {
      super();
      this.value = value;
      this.src = img;
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._iwidth = width;
      this._iheight = height;
      this.name = name;
      this.type = type;
      this.isDraggable = isDraggable;
      this.canDrag = canDrag;
      this.isShow = true;
      this.className = type;
      this.pos = 0;
      this.numFrames = numFrames;
      this.isAnimated = false;
    }
    
    setScale(scale){

        this.scale = scale;
        this._iwidth *= scale;
        this._iheight *= scale;
    }
  }

  