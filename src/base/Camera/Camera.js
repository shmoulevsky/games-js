export default class Camera {

    constructor() {

        this.x = 40;
        this.y = 40;
        this.width = 800;
        this.height = 600;
        this.speed = 5;
        this.speedX = 0;
        this.speedY = 0;
        this.mouse = {};
        this.mouse.x = 0;
        this.mouse.y = 0;
        this.isMove = false;
    }

    moveLeft(){
        this.speedX = this.speed;
        this.x += this.speedX;
        this.isMove = true;
    }

    moveRight(){
        this.speedX = -this.speed;
        this.x += this.speedX;
        this.isMove = true;
    }

    moveUp(){
        this.speedY = this.speed;
        this.y += this.speedY;
        this.isMove = true;
    }

    moveDown(){
        this.speedY = -this.speed;
        this.y += this.speedY;
        this.isMove = true;
    }

    clear(){
        this.isMove = false;
        this.speedX = 0;
        this.speedY = 0;
    }



}