export default class InputHandler {
    constructor(mainScreen) {
        this.mainScreen = mainScreen;
        this.game = mainScreen.game;
        this.keys = {};
        this.touchStartX = 0;
        this.isTouch = false;

        this.initKeyboardControls();
        this.initTouchControls();
        //this.initMouseControls();
    }

    update() {
        if (this.keys['ArrowLeft']) {
            this.mainScreen.basket.move(-15);
        }
        if (this.keys['ArrowRight']) {
            this.mainScreen.basket.move(15);
        }
    }

    initKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Предотвращаем скролл стрелками
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
            }

            // Пауза на пробел
            if (e.key === ' ') {
                this.game.isPaused = !this.game.isPaused;
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    initTouchControls() {
        this.game.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isTouch = true;
            this.touchStartX = e.touches[0].clientX;

            // Устанавливаем позицию корзины по касанию
            if (this.mainScreen.basket) {
                const rect = this.game.canvas.getBoundingClientRect();
                const touchX = (e.touches[0].clientX - rect.left) * (this.game.canvas.width / rect.width);
                this.mainScreen.basket.setTargetX(touchX);
            }
        }, { passive: false });

        this.game.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.isTouch || !this.mainScreen.basket) return;

            const rect = this.game.canvas.getBoundingClientRect();
            const touchX = (e.touches[0].clientX - rect.left) * (this.game.canvas.width / rect.width);
            this.mainScreen.basket.setTargetX(touchX);
        }, { passive: false });

        this.game.canvas.addEventListener('touchend', (e) => {})
    }
}