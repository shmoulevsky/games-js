import BaseSprite from "../../base/Images/BaseSprite";

export default  class Cloud extends BaseSprite {
    constructor(img, name, type, x, y, width, height, value, number) {
        super(img, name, type, x, y, width, height, value);
        this.number = number;
        this.speed = Math.random() * 2 + 2; // Случайная скорость от 2 до 4
        this.animationFrame = Math.random() * Math.PI * 2;
        this.originalY = y;
        this.bobAmount = Math.random() * 15 + 5; // Амплитуда покачивания
        this.numberCard = null;
    }

    update() {
        // Движение справа налево
        this._x -= this.speed;

        // Плавное покачивание
        this.animationFrame += 0.04;
        this._y = this.originalY + Math.sin(this.animationFrame) * this.bobAmount;

        // Обновляем позицию числа на облаке
        if (this.numberCard) {
            this.numberCard._x = this._x + 35;
            this.numberCard._y = this._y + 25;
        }
    }

    isOffScreen() {
        return this._x + this._width < -50;
    }

    setNumberCard(card) {
        this.numberCard = card;
    }
}