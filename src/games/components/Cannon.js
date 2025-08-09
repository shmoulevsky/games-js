// Cannon.js
export default class Cannon {
    constructor(x, y, width, height, game) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._iwidth = width;
        this._iheight = height;
        this.name = 'cannon';
        this.type = 'cannon';
        this.isShow = true;
        this.game = game;
        this.scale = 1;

        // Visual properties
        this.gradient = null;
        this.barrelGradient = null;
    }

    draw(ctx) {
        if (!this.isShow) return;

        // Create gradients if not exist
        if (!this.gradient) {
            this.gradient = ctx.createLinearGradient(
                this._x, this._y,
                this._x, this._y + this._height
            );
            this.gradient.addColorStop(0, '#4682B4');
            this.gradient.addColorStop(0.5, '#1E90FF');
            this.gradient.addColorStop(1, '#000080');
        }

        if (!this.barrelGradient) {
            this.barrelGradient = ctx.createLinearGradient(
                this._x + this._width * 0.3, this._y - 20,
                this._x + this._width * 0.7, this._y - 20
            );
            this.barrelGradient.addColorStop(0, '#2F4F4F');
            this.barrelGradient.addColorStop(0.5, '#708090');
            this.barrelGradient.addColorStop(1, '#2F4F4F');
        }

        // Draw cannon base (rounded rectangle)
        ctx.fillStyle = this.gradient;
        ctx.beginPath();
        ctx.roundRect(
            this._x,
            this._y,
            this._width * this.scale,
            this._height * this.scale,
            10
        );
        ctx.fill();

        // Add base border
        ctx.strokeStyle = '#000080';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw cannon barrel (rectangle extending upward)
        const barrelWidth = this._width * 0.4 * this.scale;
        const barrelHeight = 25 * this.scale;
        const barrelX = this._x + (this._width * 0.3) * this.scale;
        const barrelY = this._y - barrelHeight;

        ctx.fillStyle = this.barrelGradient;
        ctx.beginPath();
        ctx.roundRect(barrelX, barrelY, barrelWidth, barrelHeight, 3);
        ctx.fill();

        // Add barrel border
        ctx.strokeStyle = '#2F4F4F';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw cannon wheels (circles)
        const wheelRadius = 8 * this.scale;
        const wheel1X = this._x + 15 * this.scale;
        const wheel2X = this._x + (this._width - 15) * this.scale;
        const wheelY = this._y + this._height * this.scale;

        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.arc(wheel1X, wheelY, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wheel2X, wheelY, wheelRadius, 0, Math.PI * 2);
        ctx.fill();

        // Add wheel borders
        ctx.strokeStyle = '#2F2F2F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(wheel1X, wheelY, wheelRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(wheel2X, wheelY, wheelRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Add some decorative details
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this._x + this._width / 2, this._y + this._height / 2, 4 * this.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    setScale(scale) {
        this.scale = scale;
        this._iwidth = this._width * scale;
        this._iheight = this._height * scale;
        // Reset gradients so they'll be recreated with new scale
        this.gradient = null;
        this.barrelGradient = null;
    }
}