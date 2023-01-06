
export default class TextTransparentCard{
	
  constructor(
      name,
      type,
      x ,
      y ,
      width,
      height,
      text,
      value,
      isDraggable,
      canDrag ,
      offsetX,
      offsetY,
      color,
      size,
      font = 'Arial') {

    this.text = text;
    this.value = value;
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
    this.scale = 1;
    this.color = color;
    this.size = size;
    this.font = font;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  draw(ctx, isAnimated = false){

    ctx.font = this.size + 'px ' + this.font;
    ctx.fillStyle = this.color;
    ctx.fillText( this.text , this._x + this.offsetX , this._y + this.offsetY);
    //ctx.lineWidth = 2;
    //ctx.strokeRect(this._x, this._y, this._width * this.scale, this._height * this.scale);

  }
    
  
}