
export default class TextSimpleCard{
	
  constructor(name, type, x , y , width, height, text, value, isDraggable, canDrag , style) {

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
    this.style = style;
  }

  draw(ctx, isAnimated = false){

    ctx.fillStyle = this.style.bgColor;
    ctx.font = this.style.size + 'px ' + this.style.font;
    ctx.fillRect(this._x, this._y, this._width * this.scale, this._height * this.scale);
    ctx.strokeStyle = this.style.strokeStyle;
    ctx.lineWidth = this.style.lineWidth;
    ctx.strokeRect(this._x, this._y, this._width * this.scale, this._height * this.scale);
    ctx.fillStyle = this.style.color;
    ctx.fillText( this.text , this._x + this.style.offsetX , this._y + this.style.offsetY);

  }
    
  
}