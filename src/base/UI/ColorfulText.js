export default class ColorfulText {
    constructor(name, x, y, text, options = {}) {
        this.name = name;
        this.type = 'text';
        this.text = text;
        this.isShow = true;
        this.scale = 1;

        // Позиция
        this._x = x;
        this._y = y;
        this._baseX = x;
        this._baseY = y;
        this._width = 0;
        this._height = 0;

        // Перетаскивание
        this.isDraggable = options.isDraggable || false;
        this.canDrag = options.canDrag !== false; // по умолчанию true

        // Стили текста
        this.fontSize = options.fontSize || 24;
        this.fontFamily = options.fontFamily || 'Arial';
        this.fontWeight = options.fontWeight || 'normal';
        this.color = options.color || '#ffffff';
        this.textAlign = options.textAlign || 'center';
        this.textBaseline = options.textBaseline || 'middle';

        // Эффекты
        this.shadowColor = options.shadowColor || 'rgba(0, 0, 0, 0.5)';
        this.shadowOffsetX = options.shadowOffsetX || 2;
        this.shadowOffsetY = options.shadowOffsetY || 2;
        this.strokeColor = options.strokeColor || null;
        this.strokeWidth = options.strokeWidth || 2;
        this.glowColor = options.glowColor || null;
        this.glowBlur = options.glowBlur || 10;

        // Градиент
        this.gradientColors = options.gradientColors || null; // ['#ff0000', '#00ff00']
        this.gradientDirection = options.gradientDirection || 'vertical'; // 'vertical', 'horizontal'

        // Анимации
        this.animations = {
            float: options.float || false,
            floatAmplitude: options.floatAmplitude || 5,
            floatSpeed: options.floatSpeed || 0.02,

            pulse: options.pulse || false,
            pulseMin: options.pulseMin || 0.9,
            pulseMax: options.pulseMax || 1.1,
            pulseSpeed: options.pulseSpeed || 0.03,

            shake: options.shake || false,
            shakeAmplitude: options.shakeAmplitude || 2,
            shakeSpeed: options.shakeSpeed || 0.1,

            rainbow: options.rainbow || false,
            rainbowSpeed: options.rainbowSpeed || 0.02
        };

        // Внутренние переменные для анимаций
        this.animationTime = 0;
        this.currentScale = 1;
        this.currentOffsetX = 0;
        this.currentOffsetY = 0;
        this.currentColor = this.color;
    }

    update(deltaTime = 1) {
        this.animationTime += deltaTime;

        // Сброс значений
        this.currentScale = this.scale;
        this.currentOffsetX = 0;
        this.currentOffsetY = 0;
        this.currentColor = this.color;

        // Анимация плавания (вверх-вниз)
        if (this.animations.float) {
            this.currentOffsetY = Math.sin(this.animationTime * this.animations.floatSpeed) * this.animations.floatAmplitude;
        }

        // Анимация пульсации
        if (this.animations.pulse) {
            const pulseScale = this.animations.pulseMin +
                (this.animations.pulseMax - this.animations.pulseMin) *
                (Math.sin(this.animationTime * this.animations.pulseSpeed) * 0.5 + 0.5);
            this.currentScale *= pulseScale;
        }

        // Анимация тряски
        if (this.animations.shake) {
            this.currentOffsetX += (Math.random() - 0.5) * this.animations.shakeAmplitude;
            this.currentOffsetY += (Math.random() - 0.5) * this.animations.shakeAmplitude;
        }

        // Радужная анимация
        if (this.animations.rainbow) {
            const hue = (this.animationTime * this.animations.rainbowSpeed * 60) % 360;
            this.currentColor = `hsl(${hue}, 100%, 60%)`;
        }
    }

    draw(ctx) {
        if (!this.isShow) return;

        this.update();

        const fontSize = this.fontSize * this.currentScale;
        const x = this._x + this.currentOffsetX;
        const y = this._y + this.currentOffsetY;

        ctx.save();

        // Настройка шрифта
        ctx.font = `${this.fontWeight} ${fontSize}px ${this.fontFamily}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;

        // Вычисляем размеры для hitbox
        const metrics = ctx.measureText(this.text);
        this._width = metrics.width;
        this._height = fontSize;

        // Визуализация границ для отладки (опционально)
        if (this.showBounds) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(
                x - this._width/2,
                y - this._height/2,
                this._width,
                this._height
            );
        }

        // Эффект свечения
        if (this.glowColor) {
            ctx.shadowColor = this.glowColor;
            ctx.shadowBlur = this.glowBlur;
            ctx.fillStyle = this.glowColor;
            ctx.fillText(this.text, x, y);
            ctx.shadowBlur = 0;
        }

        // Тень
        if (this.shadowColor) {
            ctx.fillStyle = this.shadowColor;
            ctx.fillText(
                this.text,
                x + this.shadowOffsetX * this.currentScale,
                y + this.shadowOffsetY * this.currentScale
            );
        }

        // Обводка
        if (this.strokeColor) {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth * this.currentScale;
            ctx.strokeText(this.text, x, y);
        }

        // Основной текст
        if (this.gradientColors && this.gradientColors.length >= 2) {
            // Градиентный текст
            let gradient;
            if (this.gradientDirection === 'horizontal') {
                gradient = ctx.createLinearGradient(
                    x - this._width/2, y,
                    x + this._width/2, y
                );
            } else {
                gradient = ctx.createLinearGradient(
                    x, y - this._height/2,
                    x, y + this._height/2
                );
            }

            for (let i = 0; i < this.gradientColors.length; i++) {
                gradient.addColorStop(i / (this.gradientColors.length - 1), this.gradientColors[i]);
            }
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = this.currentColor;
        }

        ctx.fillText(this.text, x, y);

        ctx.restore();
    }

    // Методы для совместимости с системой перетаскивания
    checkMouseMove(e) {
        // Для текста обычно не нужно, но можно добавить hover эффекты
        if (this.canDrag && this.isDraggable) {
            // Можно добавить визуальную обратную связь при перетаскивании
        }
    }

    // Основной метод для проверки клика по тексту
    isCursorOver(e) {
        if (!this.canDrag || !this.isShow) return false;

        // Убеждаемся, что размеры текста вычислены
        if (this._width === 0 || this._height === 0) return false;

        const mx = e.pageX - e.target.offsetLeft;
        const my = e.pageY - e.target.offsetTop;

        const isOver = mx >= this._x - this._width/2 &&
            mx <= this._x + this._width/2 &&
            my >= this._y - this._height/2 &&
            my <= this._y + this._height/2;

        // Отладка (можно убрать в продакшене)
        if (isOver && this.name === 'debug') {
            console.log('Text cursor over:', {
                mx, my,
                textX: this._x,
                textY: this._y,
                textWidth: this._width,
                textHeight: this._height,
                bounds: {
                    left: this._x - this._width/2,
                    right: this._x + this._width/2,
                    top: this._y - this._height/2,
                    bottom: this._y + this._height/2
                }
            });
        }

        return isOver;
    }

    isClick(e) {
        // Проверка клика по тексту (для интерактивности или перетаскивания)
        const mx = e.pageX - e.target.offsetLeft;
        const my = e.pageY - e.target.offsetTop;

        return mx > this._x - this._width/2 &&
            mx < this._x + this._width/2 &&
            my > this._y - this._height/2 &&
            my < this._y + this._height/2 &&
            this.isShow;
    }

    // Метод для GameHelper.isCursor() совместимости
    getBounds() {
        return {
            x: this._x - this._width/2,
            y: this._y - this._height/2,
            width: this._width,
            height: this._height
        };
    }

    setScale(scale) {
        this.scale = scale;
        // Обновляем базовые координаты при масштабировании
        this._baseX = this._baseX * scale;
        this._baseY = this._baseY * scale;
    }

    // Дополнительные методы для управления перетаскиванием
    enableDrag() {
        this.canDrag = true;
    }

    disableDrag() {
        this.canDrag = false;
        this.isDraggable = false;
    }

    resetPosition() {
        this._x = this._baseX;
        this._y = this._baseY;
    }

    // Методы для управления анимациями
    startFloat(amplitude = 5, speed = 0.02) {
        this.animations.float = true;
        this.animations.floatAmplitude = amplitude;
        this.animations.floatSpeed = speed;
    }

    stopFloat() {
        this.animations.float = false;
        this.currentOffsetY = 0;
    }

    startPulse(min = 0.9, max = 1.1, speed = 0.03) {
        this.animations.pulse = true;
        this.animations.pulseMin = min;
        this.animations.pulseMax = max;
        this.animations.pulseSpeed = speed;
    }

    stopPulse() {
        this.animations.pulse = false;
        this.currentScale = this.scale;
    }

    startShake(amplitude = 2, speed = 0.1) {
        this.animations.shake = true;
        this.animations.shakeAmplitude = amplitude;
        this.animations.shakeSpeed = speed;
    }

    stopShake() {
        this.animations.shake = false;
        this.currentOffsetX = 0;
        this.currentOffsetY = 0;
    }

    startRainbow(speed = 0.02) {
        this.animations.rainbow = true;
        this.animations.rainbowSpeed = speed;
    }

    stopRainbow() {
        this.animations.rainbow = false;
        this.currentColor = this.color;
    }

    setText(newText) {
        this.text = newText;
    }

    setColor(newColor) {
        this.color = newColor;
        if (!this.animations.rainbow) {
            this.currentColor = newColor;
        }
    }

    setPosition(x, y) {
        this._x = x;
        this._y = y;
    }
}

// Примеры использования:
/*
// Обычный текст
const simpleText = new ColorfulText('title', 400, 100, 'Math Owl', {
    fontSize: 48,
    color: '#FFD700',
    fontWeight: 'bold'
});

// Перетаскиваемый плавающий текст
const draggableText = new ColorfulText('draggable-title', 400, 200, 'Перетащи меня!', {
    fontSize: 32,
    color: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffsetX: 3,
    shadowOffsetY: 3,
    float: true,
    floatAmplitude: 5,
    isDraggable: false, // будет установлено в true при клике
    canDrag: true,
    showBounds: false // true для отладки границ
});

// Радужный пульсирующий перетаскиваемый текст
const interactiveText = new ColorfulText('interactive', 400, 300, 'DRAG ME!', {
    fontSize: 36,
    fontWeight: 'bold',
    strokeColor: '#000000',
    strokeWidth: 2,
    pulse: true,
    rainbow: true,
    pulseMin: 0.8,
    pulseMax: 1.2,
    canDrag: true
});

// В GameHelper.js нужно добавить поддержку для текста:
// isCursor(e, item) {
//     if (item.type === 'text') {
//         const bounds = item.getBounds();
//         const mx = e.pageX - e.target.offsetLeft;
//         const my = e.pageY - e.target.offsetTop;
//         return mx >= bounds.x && mx <= bounds.x + bounds.width &&
//                my >= bounds.y && my <= bounds.y + bounds.height;
//     }
//     // ... остальная логика для других типов
// }
*/