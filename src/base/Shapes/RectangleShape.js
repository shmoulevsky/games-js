import BaseShape from "./BaseShape";
export default class RectangleShape extends BaseShape{
    constructor(name, type, x , y , width, height, value, color, borderColor, isDraggable, canDrag) {
        super(name, type, x , y , width, height, value, color, borderColor, isDraggable, canDrag);

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
        this.color = color;
        this.value = value;
        this.scale = 1;
    }

    draw(ctx, isAnimated){

        ctx.fillStyle = this.color;
        ctx.fillRect(this._x, this._y, this._width * this.scale, this._height * this.scale);
    }

}