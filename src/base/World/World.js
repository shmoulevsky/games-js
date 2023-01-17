export default class World{

    constructor(canvasId, width, height) {

        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;

        this.canvasId = canvasId;
        this.offsetX = document.getElementById(this.canvasId).offsetLeft;
        this.offsetY = document.getElementById(this.canvasId).offsetTop;
    }

    hide(){
        document.getElementById(this.canvasId).style.display = 'none';
    }

    show(){
        document.getElementById(this.canvasId).style.display = 'block';
    }
}