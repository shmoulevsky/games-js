export default class Basket {
    constructor(x, y, width, height, moveSpeed = 7) {
        this.x = x;
        this.y = y;
        this.targetX = x; // Для плавного движения
        this.width = width;
        this.height = height;
        this.moveSpeed = moveSpeed;
        this.minX = width / 2;
        this.maxX = 1024 - width / 2; // Предполагаем стандартную ширину экрана
        this.bouncePhase = 0; // Для анимации подпрыгивания при ловле
        this.bounceAmplitude = 0;
    }

    update() {
        // Плавное движение к целевой позиции
        const dx = this.targetX - this.x;
        if (Math.abs(dx) > 1) {
            this.x += dx * 0.2; // Плавность движения
        }

        // Ограничиваем движение границами экрана
        this.x = Math.max(this.minX, Math.min(this.maxX, this.x));

        // Обновляем анимацию подпрыгивания
        if (this.bounceAmplitude > 0) {
            this.bouncePhase += 0.3;
            this.bounceAmplitude *= 0.9; // Затухание
            if (this.bounceAmplitude < 1) {
                this.bounceAmplitude = 0;
                this.bouncePhase = 0;
            }
        }
    }

    move(delta) {
        this.targetX += delta;
        this.targetX = Math.max(this.minX, Math.min(this.maxX, this.targetX));
    }

    setTargetX(x) {
        this.targetX = Math.max(this.minX, Math.min(this.maxX, x));
    }

    // Вызывается при ловле числа
    bounce() {
        this.bounceAmplitude = 10;
        this.bouncePhase = 0;
    }

    draw(ctx) {
        this.update();

        const bounceOffset = Math.sin(this.bouncePhase) * this.bounceAmplitude;
        const drawY = this.y - bounceOffset;

        // Тень
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;

        // Основание корзины
        const basketPath = new Path2D();
        basketPath.roundRect(
            this.x - this.width / 2,
            drawY,
            this.width,
            this.height * 0.7,
            15
        );
        ctx.fillStyle = '#8B4513';
        ctx.fill(basketPath);

        // Внутренняя часть корзины
        const innerPath = new Path2D();
        innerPath.roundRect(
            this.x - this.width / 2 + 5,
            drawY + 5,
            this.width - 10,
            this.height * 0.6 - 5,
            10
        );
        ctx.fillStyle = '#D2691E';
        ctx.fill(innerPath);

        // Узор плетения
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const lineY = drawY + 15 + i * 15;
            ctx.beginPath();
            ctx.moveTo(this.x - this.width / 2 + 10, lineY);
            ctx.lineTo(this.x + this.width / 2 - 10, lineY);
            ctx.stroke();
        }

        // Ручки корзины
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';

        // Левая ручка
        ctx.beginPath();
        ctx.moveTo(this.x - this.width / 2 - 10, drawY + 15);
        ctx.quadraticCurveTo(
            this.x - this.width / 2 - 20,
            drawY + 35,
            this.x - this.width / 2 - 10,
            drawY + 55
        );
        ctx.stroke();

        // Правая ручка
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 + 10, drawY + 15);
        ctx.quadraticCurveTo(
            this.x + this.width / 2 + 20,
            drawY + 35,
            this.x + this.width / 2 + 10,
            drawY + 55
        );
        ctx.stroke();

        // Сброс тени
        ctx.shadowColor = 'transparent';
    }

    // Установка границ для разных размеров экрана
    setBounds(minX, maxX) {
        this.minX = minX;
        this.maxX = maxX;
    }
}