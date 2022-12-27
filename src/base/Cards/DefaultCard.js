export default class DefaultCard{

    constructor(){
        this.tag = 'digit'
        this.width = 70;
        this.height = 70;
        this.isDraggable = false;
        this.canDrag = false;
        this.canvasId = 'card-canvas';
        this.fontStyle = {};
        this.fontStyle.size = '40';
        this.fontStyle.font = 'Arial';
        this.fontStyle.color1 = 'black';
        this.fontStyle.color2 = 'red';
        this.fontStyle.x = 30;
        this.fontStyle.xoffset = 10;
        this.fontStyle.y = 50;
    }
}