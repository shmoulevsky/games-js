// FloatingTarget.js
export default class FloatingTarget {
    constructor(x, y, width, height, value, correctAnswer, game) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._iwidth = width;
        this._iheight = height;
        this.name = 'target';
        this.type = 'target';
        this.isShow = true;
        this.value = value;
        this.isCorrect = value === correctAnswer;
        this.game = game;
        this.scale = 1;

        // Movement properties
        this.speedX = (Math.random() - 0.5) * 2; // Random horizontal movement
        this.speedY = Math.sin(Date.now() * 0.001) * 0.5; // Floating vertical movement
        this.baseY = y;
        this.time = Math.random() * Math.PI * 2; // Random phase for floating

        // Visual properties
        this.pulseTime = 0;
        this.gradient = null;
    }

    update() {
        // Horizontal movement with boundary bouncing
        this._x += this.speedX;
        if (this._x <= 0 || this._x >= this.game.settings.width - this._width) {
            this.speedX *= -1;
        }

        // Floating vertical movement
        this.time += 0.05;
        this._y = this.baseY + Math.sin(this.time) * 15;

        // Pulse effect for correct answer
        this.pulseTime += 0.1;
    }

    draw(ctx) {
        if (!this.isShow) return;

        // Create gradient based on correctness
        if (!this.gradient) {
            this.gradient = ctx.createRadialGradient(
                this._x + this._width / 2, this._y + this._height / 2, 0,
                this._x + this._width / 2, this._y + this._height / 2, this._width / 2
            );

            if (this.isCorrect) {
                this.gradient.addColorStop(0, '#90EE90');
                this.gradient.addColorStop(0.7, '#32CD32');
                this.gradient.addColorStop(1, '#228B22');
            } else {
                this.gradient.addColorStop(0, '#FFB6C1');
                this.gradient.addColorStop(0.7, '#FF69B4');
                this.gradient.addColorStop(1, '#FF1493');
            }
        }

        // Draw target background with glow
        if (this.isCorrect) {
            ctx.shadowColor = '#32CD32';
            ctx.shadowBlur = 15 + Math.sin(this.pulseTime) * 5;
        } else {
            ctx.shadowColor = '#FF69B4';
            ctx.shadowBlur = 8;
        }

        ctx.fillStyle = this.gradient;

        // Draw circular target
        ctx.beginPath();
        ctx.arc(
            this._x + this._width / 2,
            this._y + this._height / 2,
            (this._width / 2) * this.scale,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;

        // Add border
        ctx.strokeStyle = this.isCorrect ? '#228B22' : '#FF1493';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw number
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;

        const textX = this._x + this._width / 2;
        const textY = this._y + this._height / 2;

        ctx.strokeText(this.value.toString(), textX, textY);
        ctx.fillText(this.value.toString(), textX, textY);

        // Reset text alignment
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }

    setScale(scale) {
        this.scale = scale;
        this._iwidth = this._width * scale;
        this._iheight = this._height * scale;
    }
}