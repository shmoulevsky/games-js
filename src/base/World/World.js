export default class World{

    constructor(canvasId) {

        this.width = 3570;
        this.height = 2160;
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