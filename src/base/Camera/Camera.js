export default class Camera {

    constructor() {

        this.x = 0;
        this.y = 0;
        this.width = 1024;
        this.height = 700;
        this.speed = 5;
        this.speedX = 0;
        this.speedY = 0;
        this.mouse = {};
        this.mouse.x = 0;
        this.mouse.y = 0;
        this.isMove = false;
        this.isStoped = false;
    }

    moveLeft(speed = 1){
        this.speedX = this.speed;
        this.x += this.speedX;
        this.isMove = true;
    }

    moveRight(speed = 1){
        this.speedX = -this.speed;
        this.x += this.speedX;
        this.isMove = true;
    }

    moveUp(speed = 1){
        this.speedY = this.speed;
        this.y += this.speedY;
        this.isMove = true;
    }

    moveDown(speed = 1){
        this.speedY = -this.speed;
        this.y += (this.speedY);
        this.isMove = true;
    }

    clear(){
        this.isMove = false;
        this.speedX = 0;
        this.speedY = 0;
    }



}