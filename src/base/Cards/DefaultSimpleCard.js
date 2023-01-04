export default class DefaultSimpleCard{

    constructor(){
        this.tag = 'digit'
        this.width = 70;
        this.height = 70;
        this.isDraggable = false;
        this.canDrag = false;
        this.style = {};
        this.style.size = '40';
        this.style.font = 'Arial';
        this.style.bgColor = 'white';
        this.style.color = 'black';
        this.style.strokeStyle = 'black';
        this.style.lineWidth = 2;
        this.style.offsetX = 10;
        this.style.offsetY = 20;
    }
}