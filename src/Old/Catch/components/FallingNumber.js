export default class FallingNumber {
    constructor(x, value, fallSpeed = 2) {
        this.x = x;
        this.y = -50;
        this.value = value;
        this.speed = fallSpeed + Math.random() * 1.5;
        this.radius = 25;
        this.color = this.getRandomColor();
        this.scale = 1;
        this.pulsePhase = Math.random() * Math.PI * 2; // Для анимации пульсации
    }

    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1',
            '#96CEB4', '#FECA57', '#FF9FF3',
            '#A8E6CF', '#FFB6C1', '#DDA0DD'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speed;
        this.pulsePhase += 0.1;
        this.scale = 1 + Math.sin(this.pulsePhase) * 0.1; // Легкая пульсация
    }

    draw(ctx) {
        const currentRadius = this.radius * this.scale;

        // Тень
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;

        // Основной круг
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Внутренний блик


        // Бордер
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Число
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.floor(20 * this.scale)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.value.toString(), this.x, this.y);

        // Сброс тени
        ctx.shadowColor = 'transparent';
    }

    isOffScreen(screenHeight) {
        return this.y > screenHeight + 50;
    }

    checkCollision(basket) {
        const dx = this.x - basket.x;
        const dy = this.y - (basket.y + basket.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius + basket.width / 3 &&
            this.y + this.radius > basket.y &&
            this.y < basket.y + basket.height;
    }

    // Метод для изменения скорости (может использоваться для усложнения игры)
    setSpeed(newSpeed) {
        this.speed = newSpeed + Math.random() * 1.5;
    }
}