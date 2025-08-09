export default class ColorfulButton {
    constructor(name, x, y, text, bgColor = '#ff69b4', hoverColor = '#ffd700', value = '') {
        this.name = name;
        this.type = 'button';
        this.text = text;
        this.bgColor = bgColor;
        this.hoverColor = hoverColor;
        this.value = value;
        this.isShow = true;
        this.isHovered = false;
        this.isPressed = false;
        this.scale = 1;
        this.paddingX = 40;
        this.paddingY = 25;
        this.shadowOffset = 8;

        // Рассчитываем размеры по тексту (временно — позже уточняется в draw)
        this._x = x;
        this._y = y;
        this._width = 200;
        this._height = 60;
    }

    draw(ctx) {
        const fontSize = 28 * this.scale;
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        const textMetrics = ctx.measureText(this.text);
        this._width = Math.max(textMetrics.width + this.paddingX * 2, 120 * this.scale);
        this._height = fontSize + this.paddingY * 2;

        const currentScale = this.scale;
        const x = this._x;
        const y = this._y;
        const w = this._width * currentScale;
        const h = this._height * currentScale;
        const radius = 25 * currentScale;
        const shadowOffset = this.shadowOffset * currentScale * (this.isPressed ? 0.3 : 1);

        ctx.save();

        // Тень кнопки
        const shadowGradient = ctx.createRadialGradient(
            x + w/2, y + h/2 + shadowOffset, 0,
            x + w/2, y + h/2 + shadowOffset, Math.max(w, h) * 0.8
        );
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowGradient;
        this.#roundRect(ctx, x - 10, y + shadowOffset - 5, w + 20, h + 15, radius + 5, true, false);

        // Основной фон кнопки с многослойным градиентом
        const mainGradient = ctx.createLinearGradient(x, y, x, y + h);
        if (this.isHovered) {
            mainGradient.addColorStop(0, this.#lightenColor(this.hoverColor, 30));
            mainGradient.addColorStop(0.4, this.#lightenColor(this.hoverColor, 10));
            mainGradient.addColorStop(1, this.#darkenColor(this.hoverColor, 20));
        } else {
            mainGradient.addColorStop(0, this.#lightenColor(this.bgColor, 20));
            mainGradient.addColorStop(0.4, this.bgColor);
            mainGradient.addColorStop(1, this.#darkenColor(this.bgColor, 30));
        }

        ctx.fillStyle = mainGradient;
        this.#roundRect(ctx, x, y, w, h, radius, true, false);

        // Подсветка при наведении
        if (this.isHovered) {
            const glowGradient = ctx.createRadialGradient(x + w/2, y + h/2, 0, x + w/2, y + h/2, Math.max(w, h) * 0.7);
            glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = glowGradient;
            this.#roundRect(ctx, x, y, w, h, radius, true, false);
        }

        // Внутренняя обводка (светлая)
        ctx.strokeStyle = this.#lightenColor(this.isHovered ? this.hoverColor : this.bgColor, 40);
        ctx.lineWidth = 3 * currentScale;
        this.#roundRect(ctx, x + 2, y + 2, w - 4, h - 4, radius - 2, false, true);

        // Внешняя обводка (темная)
        ctx.strokeStyle = this.#darkenColor(this.isHovered ? this.hoverColor : this.bgColor, 40);
        ctx.lineWidth = 2 * currentScale;
        this.#roundRect(ctx, x, y, w, h, radius, false, true);

        // Дополнительная обводка при наведении
        if (this.isHovered) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3 * currentScale;
            this.#roundRect(ctx, x - 3, y - 3, w + 6, h + 6, radius + 3, false, true);
        }

        // Верхний блик
        const topShine = ctx.createLinearGradient(x, y, x, y + h * 0.6);
        topShine.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        topShine.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
        topShine.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = topShine;
        this.#roundRect(ctx, x + 4, y + 4, w - 8, h * 0.4, radius * 0.7, true, false);

        // Боковые блики для 3D эффекта
        const leftShine = ctx.createLinearGradient(x, y, x + w * 0.3, y);
        leftShine.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        leftShine.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = leftShine;
        this.#roundRect(ctx, x + 2, y + 6, w * 0.15, h - 12, radius * 0.3, true, false);

        // Центральный блик
        const centerShine = ctx.createRadialGradient(
            x + w * 0.3, y + h * 0.2, 0,
            x + w * 0.3, y + h * 0.2, Math.min(w, h) * 0.4
        );
        centerShine.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        centerShine.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        centerShine.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = centerShine;
        ctx.fillRect(x, y, w, h * 0.5);

        // Текст с тенью
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.font = `bold ${fontSize * currentScale}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, x + w/2 + 2, y + h/2 + 2);

        // Основной текст с обводкой
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeText(this.text, x + w/2, y + h/2);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.text, x + w/2, y + h/2);

        ctx.restore();
    }

    checkMouseMove(e) {
        const mx = e.pageX - e.target.offsetLeft;
        const my = e.pageY - e.target.offsetTop;

        this.isHovered = mx > this._x && mx < this._x + this._width &&
            my > this._y && my < this._y + this._height;
    }

    onMouseDown(e) {
        if (this.isHovered) {
            this.isPressed = true;
        }
    }

    onMouseUp(e) {
        this.isPressed = false;
    }

    isClick(e) {
        const mx = e.pageX - e.target.offsetLeft;
        const my = e.pageY - e.target.offsetTop;
        return mx > this._x && mx < this._x + this._width &&
            my > this._y && my < this._y + this._height &&
            this.isShow;
    }

    setScale(scale) {
        this.scale = scale;
    }

    #roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();

        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    }

    #lightenColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    #darkenColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }
}