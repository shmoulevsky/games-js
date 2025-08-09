// MainScreen.js
import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import UIRenderer from "../../../base/UI/UIRenderer";
import FloatingTarget from "../../components/FloatingTarget";
import Cannon from "../../components/Cannon";
import Bullet from "../../components/Bullet";


export class MainScreen extends GameScreen {
    constructor(bgImg, game) {
        super();
        this.game = game;
        this.bg = bgImg;
        this.name = 'game';
        this.width = game.settings.width;
        this.height = game.settings.height;

        this.cannon = null;
        this.bullets = [];
        this.targets = [];
        this.lives = 3;
        this.score = 0;
        this.currentExpression = {};

        this.uiRenderer = new UIRenderer();
        this.gameLoopInterval = null;
        this.targetSpawnInterval = null;

        // Input handling
        this.keys = {};
        this.mouseX = 0;
        this.touchX = 0;
        this.isTouch = false;

        this.setupInputHandlers();
    }

    setupInputHandlers() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                this.shoot();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Mouse events
        this.game.canvas.addEventListener('mousemove', (e) => {
            const rect = this.game.canvas.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left) / this.game.scale;
            this.isTouch = false;
        });

        this.game.canvas.addEventListener('click', (e) => {
            if (!this.isTouch) {
                this.shoot();
            }
        });

        // Touch events
        this.game.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isTouch = true;
            const rect = this.game.canvas.getBoundingClientRect();
            this.touchX = (e.touches[0].clientX - rect.left) / this.game.scale;
        });

        this.game.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.game.canvas.getBoundingClientRect();
            this.touchX = (e.touches[0].clientX - rect.left) / this.game.scale;
        });

        this.game.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.shoot();
        });
    }

    initScene() {
        clearInterval(this.gameLoopInterval);
        clearInterval(this.targetSpawnInterval);

        this.items = [];
        this.bullets = [];
        this.targets = [];
        this.lives = 3;
        this.score = 0;

        if (this.bg) {
            let bg = new BaseSprite(this.game.settings.path.img + this.bg, 'bg', 'bg', 0, 0, this.width, this.height, ' ');
            this.items.push(bg);
        }

        // Create cannon
        this.cannon = new Cannon(this.width / 2, this.height - 80, 60, 40, this.game);
        this.items.push(this.cannon);

        // UI elements
        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);

        this.generateNewExpression();
        this.startGameLoop();
        this.setTimer();
    }

    generateNewExpression() {

        let min = this.game.settings.options[1].min;
        let max = this.game.settings.options[1].max;

        const a = this.getRandomInt(min, max);
        const b = this.getRandomInt(min, max);

        const operation = this.game.settings.options[0];

        let answer;
        let expression;

        switch (operation) {
            case 'plus':
                answer = a + b;
                expression = `${a} + ${b} = ?`;
                break;
            case 'minus':
                // Ensure positive result
                const larger = Math.max(a, b);
                const smaller = Math.min(a, b);
                answer = larger - smaller;
                expression = `${larger} - ${smaller} = ?`;
                break;
            case 'multiply':
                // Use smaller numbers for multiplication
                const x = this.getRandomInt(min, max);
                const y = this.getRandomInt(min, max);
                answer = x * y;
                expression = `${x} × ${y} = ?`;
                break;
        }

        this.currentExpression = { expression, answer };
        this.spawnTargets();
    }

    spawnTargets() {
        // Clear existing targets
        this.targets.forEach(target => {
            const index = this.items.indexOf(target);
            if (index > -1) this.items.splice(index, 1);
        });
        this.targets = [];

        // Create 5 targets, one with correct answer
        const targetValues = new Set();
        targetValues.add(this.currentExpression.answer);

        // Add 4 wrong answers
        while (targetValues.size < 5) {
            let wrongAnswer;
            do {
                wrongAnswer = this.getRandomInt(
                    Math.max(1, this.currentExpression.answer - 10),
                    this.currentExpression.answer + 10
                );
            } while (targetValues.has(wrongAnswer));
            targetValues.add(wrongAnswer);
        }

        // Convert to array and shuffle
        const values = Array.from(targetValues).sort(() => Math.random() - 0.5);

        // Create floating targets
        values.forEach((value, index) => {
            const x = (index * 150) + 100;
            const y = 100;
            const target = new FloatingTarget(x, y, 60, 60, value, this.currentExpression.answer, this.game);
            this.targets.push(target);
            this.items.push(target);
        });
    }

    shoot() {
        if (!this.isShow) return;

        const bullet = new Bullet(
            this.cannon._x + this.cannon._width / 2 - 5,
            this.cannon._y - 10,
            10,
            20,
            this.game
        );
        this.bullets.push(bullet);
        this.items.push(bullet);
    }

    startGameLoop() {
        this.gameLoopInterval = setInterval(() => {
            if (!this.isShow) return;

            this.updateCannon();
            this.updateBullets();
            this.updateTargets();
            this.checkCollisions();

        }, 16); // ~60 FPS
    }

    updateCannon() {
        // Move cannon based on input
        let targetX = this.cannon._x;

        if (this.isTouch) {
            targetX = this.touchX - this.cannon._width / 2;
        } else {
            targetX = this.mouseX - this.cannon._width / 2;
        }

        // Keyboard movement
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            targetX = this.cannon._x - 5;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            targetX = this.cannon._x + 5;
        }

        // Keep cannon within bounds
        targetX = Math.max(0, Math.min(targetX, this.width - this.cannon._width));
        this.cannon._x = targetX;
    }

    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();

            // Remove bullets that are off screen
            if (bullet._y < -bullet._height) {
                this.bullets.splice(i, 1);
                const itemIndex = this.items.indexOf(bullet);
                if (itemIndex > -1) this.items.splice(itemIndex, 1);
            }
        }
    }

    updateTargets() {
        this.targets.forEach(target => {
            target.update();
        });
    }

    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];

            for (let j = this.targets.length - 1; j >= 0; j--) {
                const target = this.targets[j];

                if (this.game.helper.isIntersect(bullet, target)) {
                    // Remove bullet
                    this.bullets.splice(i, 1);
                    let itemIndex = this.items.indexOf(bullet);
                    if (itemIndex > -1) this.items.splice(itemIndex, 1);

                    // Check if answer is correct
                    if (target.isCorrect) {
                        this.score++;
                        this.game.uiManager.right++;
                        this.game.uiManager.points += 10;
                        this.game.uiManager.tweens['ok'].play();
                        this.game.uiManager.tweens['ok'].restart();

                        // Generate new expression after short delay
                        setTimeout(() => {
                            this.generateNewExpression();
                        }, 500);
                    } else {
                        this.lives--;
                        this.game.uiManager.wrong++;
                        this.game.uiManager.tweens['wrong'].play();
                        this.game.uiManager.tweens['wrong'].restart();

                        if (this.lives <= 0) {
                            this.endGame();
                            return;
                        }

                        // Generate new expression after short delay
                        setTimeout(() => {
                            this.generateNewExpression();
                        }, 500);
                    }

                    // Remove target
                    this.targets.splice(j, 1);
                    itemIndex = this.items.indexOf(target);
                    if (itemIndex > -1) this.items.splice(itemIndex, 1);

                    break;
                }
            }
        }
    }

    endGame() {
        clearInterval(this.gameLoopInterval);
        clearInterval(this.targetSpawnInterval);
        clearInterval(this.game.timerId);
        this.game.showScreen(1, 2);
    }

    setTimer() {
        this.game.minutes = this.game.settings.time.all;
        this.game.seconds = 0;

        clearInterval(this.game.timerId);

        this.game.timerId = setInterval(() => {
            if (!this.game.isPaused) {
                this.game.seconds--;
            }

            if (this.game.minutes === 0 && this.game.seconds === 0) {
                this.endGame();
            }

            if (this.game.seconds <= 0 && this.game.minutes > 0) {
                this.game.seconds = 59;
                this.game.minutes--;
            }

        }, 1000);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    checkMouseClick(e) {
        // Handled by event listeners
    }

    checkMouseMove(e) {
        // Handled by event listeners
    }

    handleKeyDown(key) {

    }

    render() {
        // Render basic UI
        this.uiRenderer.render(
            this.game.ctx,
            this.game.uiManager.right,
            this.game.uiManager.wrong,
            this.game.uiManager.points,
            this.game.settings.width,
            this.game.settings.height,
            this.game.minutes,
            this.game.seconds,
            0
        );

        // Format time display
        let seconds = this.game.seconds < 10 ? '0' + this.game.seconds : this.game.seconds;
        let minutes = this.game.minutes < 10 ? '0' + this.game.minutes : this.game.minutes;

        // Draw math expression
        this.game.ctx.fillStyle = "#FFD700";
        this.game.ctx.font = "bold 32px Arial";
        this.game.ctx.strokeStyle = "#8B4513";
        this.game.ctx.lineWidth = 3;
        this.game.ctx.strokeText(this.currentExpression.expression, 150, 70);
        this.game.ctx.fillText(this.currentExpression.expression, 150, 70);


        // Draw instructions for mobile
        if (this.isTouch) {
            this.game.ctx.fillStyle = "#FFFFFF";
            this.game.ctx.font = "18px Arial";
            this.game.ctx.strokeStyle = "#000";
            this.game.ctx.lineWidth = 1;
            this.game.ctx.strokeText("Move: Touch & Drag, Shoot: Tap", 10, this.height - 20);
            this.game.ctx.fillText("Move: Touch & Drag, Shoot: Tap", 10, this.height - 20);
        } else {
            this.game.ctx.fillStyle = "#FFFFFF";
            this.game.ctx.font = "18px Arial";
            this.game.ctx.strokeStyle = "#000";
            this.game.ctx.lineWidth = 1;
            this.game.ctx.strokeText("Move: Arrow Keys/Mouse, Shoot: Space/Click", 10, this.height - 20);
            this.game.ctx.fillText("Move: Arrow Keys/Mouse, Shoot: Space/Click", 10, this.height - 20);
        }
    }

    restart() {
        this.initScene();
    }
}