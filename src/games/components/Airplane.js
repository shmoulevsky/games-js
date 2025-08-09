import BaseSprite from "../../base/Images/BaseSprite";

export default class Airplane extends BaseSprite {
    constructor(img, name, type, x, y, width, height, value) {
        super(img, name, type, x, y, width, height, value);
        this.speed = 5;
        this.targetY = y;
        this.animationFrame = 0;
        this.bobAmount = 2;
    }

    update() {
        // Плавное движение к целевой позиции
        if (Math.abs(this._y - this.targetY) > 3) {
            this._y += (this.targetY - this._y) * 0.15;
        }

        // Анимация покачивания
        this.animationFrame += 0.08;
        this._y += Math.sin(this.animationFrame) * this.bobAmount;
    }

    moveUp() {
        this.targetY = Math.max(120, this.targetY - 80);
    }

    moveDown() {
        this.targetY = Math.min(580, this.targetY + 80);
    }

    moveLeft() {
        this._x = Math.max(50, this._x - 20);
    }

    moveRight() {
        this._x = Math.min(300, this._x + 20);
    }
}