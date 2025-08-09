// Bullet.js
export default class Bullet {
    constructor(x, y, width, height, game) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._iwidth = width;
        this._iheight = height;
        this.name = 'bullet';
        this.type = 'bullet';
        this.isShow = true;
        this.speed = 8;
        this.game = game;
        this.scale = 1;

        // Bullet properties for visual effect
        this.gradient = null;
    }

    update() {
        this._y -= this.speed;
    }

    draw(ctx) {
        if (!this.isShow) return;

        // Create gradient for bullet effect
        if (!this.gradient) {
            this.gradient = ctx.createRadialGradient(
                this._x + this._width / 2, this._y + this._height / 2, 0,
                this._x + this._width / 2, this._y + this._height / 2, this._width / 2
            );
            this.gradient.addColorStop(0, '#FFD700');
            this.gradient.addColorStop(0.7, '#FFA500');
            this.gradient.addColorStop(1, '#FF8C00');
        }

        // Draw bullet with glow effect
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.gradient;

        // Draw bullet as rounded rectangle
        ctx.beginPath();
        ctx.roundRect(this._x, this._y, this._width * this.scale, this._height * this.scale, 5);
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;

        // Add border
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    setScale(scale) {
        this.scale = scale;
        this._iwidth = this._width * scale;
        this._iheight = this._height * scale;
    }
}