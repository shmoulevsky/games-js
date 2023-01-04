import Card from './Card';

export default class TextCard extends Card{
	
  constructor(img, name, type, x , y , width, height, value, isDraggable, canDrag , canvasId, bg, numFrames = 1, fontStyle) {
    super();

    let canvas = document.getElementById(canvasId);
    canvas.width = width * numFrames;
    canvas.height = height;

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    this.numFrames = numFrames;
    
    ctx.drawImage(bg, 0, 0, this._width, this._height);
    ctx.font = fontStyle.size + 'px ' + fontStyle.font ;
    ctx.fillStyle = fontStyle.color1;
  
  x = fontStyle.x;
  
  if(this.value >= 10)
  {
    x = fontStyle.xoffset;
  }
  
  if(this.value >= 100)
  {
    x = fontStyle.xoffset2;
  }
  ctx.fillText( this.value , x, fontStyle.y);

  if(this.numFrames > 1)
  {
    ctx.fillStyle = fontStyle.color2;
    ctx.drawImage(bg, this._width, 0, this._width, this._height);
    ctx.fillText( this.value , x + this._width, fontStyle.y);

    ctx.fillStyle = fontStyle.color3;
    ctx.drawImage(bg, this._width*2, 0, this._width, this._height);
    ctx.fillText( this.value , x + this._width*2, fontStyle.y);

  }
  
  this.src = canvas.toDataURL("image/png", 1.0);

  }
    
  
}