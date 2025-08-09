import GameScreen from './../../../base/Screens/GameScreen';
import BaseSprite from './../../../base/Images/BaseSprite';
import UIRenderer from "../../../base/UI/UIRenderer";
import MathProblem from "../../../base/PlayLogic/MathProblem";
import InputHandler from "../../components/InputHandler";
import Basket from "../../components/Basket";
import FallingNumber from "../../components/FallingNumber";


// основной класс игры Math Catch
export class MainScreen extends GameScreen {

    constructor(bgImg, game, hero) {
        super();
        this.hero = hero;
        this.game = game;
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.uiRenderer = new UIRenderer();
        this.game.isPaused = false;
        this.bg = bgImg;
        this.name = 'game';

        // Игровые объекты
        this.basket = null;

        this.fallingNumbers = [];
        this.inputHandler = new InputHandler(this);

        // Игровые параметры
        this.lastSpawn = 0;
        this.spawnInterval = this.game.settings.spawnInterval || 2000;
        this.lastTime = 0;
        this.animationFrame = 0;

        // Управление облаками для анимации
        this.clouds = this.initClouds();
    }

    initScene() {
        this.setTimer();
        this.prepareRound();
        this.initializeNumbers();
    }

    prepareRound() {
        this.items = [];
        this.fallingNumbers = [];
        this.mathProblem = new MathProblem(this.game.settings.options[1], this.game.settings.options[0]);

        // Фон
        if (this.bg) {
            let bg = new BaseSprite(
                this.game.settings.path.img + this.bg,
                'bg', 'bg', 0, 0, this.width, this.height, ' '
            );
            this.items.push(bg);
        }

        // Герой
        if (this.hero) {
            let hero = new BaseSprite(
                this.game.settings.path.img + this.hero.path,
                'hero', 'hero', this.hero.x, this.hero.y,
                this.hero.width, this.hero.height, ' '
            );
            this.items.push(hero);
        }

        // UI элементы
        let btn = new BaseSprite(
            this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn', 'update',
            this.game.settings.width - 100, this.game.settings.height - 100,
            50, 49, ' '
        );
        this.items.push(btn);

        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);

        // Создаем корзину
        this.basket = new Basket(
            this.width / 2,
            this.height - 100,
            120,
            80,
            this.game.settings.basketSpeed || 7
        );
    }

    initClouds() {
        const clouds = [];
        for (let i = 0; i < 5; i++) {
            clouds.push({
                x: Math.random() * this.width,
                y: 50 + i * 50,
                speed: 0.5 + Math.random() * 0.5,
                size: 30 + Math.random() * 20
            });
        }
        return clouds;
    }

    initializeNumbers() {
        const possibleNumbers = [];
        const answer = this.mathProblem.answer;

        // Добавляем правильный ответ
        possibleNumbers.push(answer);

        // Добавляем неправильные ответы
        for (let i = 0; i < 8; i++) {
            let wrong = answer + Math.floor(Math.random() * 10) - 5;
            if (wrong === answer) wrong += 1;
            if (wrong < 0) wrong = Math.abs(wrong);
            possibleNumbers.push(wrong);
        }

        this.currentNumbers = possibleNumbers;
    }

    spawnNumber() {
        if (this.currentNumbers.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.currentNumbers.length);
        const value = this.currentNumbers[randomIndex];
        const x = 50 + Math.random() * (this.width - 100);

        const fallingNumber = new FallingNumber(x, value, this.game.settings.fallSpeed || 2);
        this.fallingNumbers.push(fallingNumber);
    }

    updateGame(deltaTime) {
        if (this.game.isPaused) return;

        // Обновляем ввод
        this.inputHandler.update();

        // Обновляем облака
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.width + 50) {
                cloud.x = -50;
            }
        });

        // Обновляем падающие числа
        this.fallingNumbers.forEach((number, index) => {
            number.update();

            // Проверяем столкновение с корзиной
            if (number.checkCollision(this.basket)) {
                if (this.mathProblem.check(number.value)) {
                    // Правильный ответ
                    this.game.uiManager.right++;
                    this.game.uiManager.points += 10;


                    // Генерируем новый пример
                    this.mathProblem.generate();
                    this.initializeNumbers();
                } else {
                    // Неправильный ответ
                    this.game.uiManager.wrong++;
                    this.game.uiManager.points = Math.max(0, this.game.uiManager.points - 5);

                }

                this.fallingNumbers.splice(index, 1);
                return;
            }

            // Удаляем числа, которые упали за экран
            if (number.isOffScreen(this.height)) {
                this.fallingNumbers.splice(index, 1);
            }
        });

        // Спавним новые числа
        this.lastSpawn += deltaTime;
        if (this.lastSpawn > this.spawnInterval) {
            this.spawnNumber();
            this.lastSpawn = 0;
        }
    }

    checkMouseMove(e) {
        if (this.game.isPaused) return;

        // Управление корзиной мышью
        if (this.basket) {
            const rect = this.game.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            this.basket.setTargetX(mouseX);
        }
    }

    checkMouseClick(e) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow) {
                this.restartGame();
            }
        }
    }

    checkMouseUp(e) {
        // Обработка отпускания мыши, если нужно
    }

    restartGame() {
        this.game.uiManager.right = 0;
        this.game.uiManager.wrong = 0;
        this.game.uiManager.points = 0;
        this.fallingNumbers = [];
        this.mathProblem.generate();
        this.initializeNumbers();
        this.lastSpawn = 0;
        this.setTimer();
    }

    // Таймер
    setTimer() {
        this.game.minutes = this.game.settings.time.all;
        this.game.seconds = 0;

        clearInterval(this.game.timerId);

        this.game.timerId = setInterval(() => {
            if (!this.game.isPaused) {
                this.game.seconds--;
            }

            if (this.game.minutes === 0 && this.game.seconds === 0) {
                this.game.showScreen(2, 3); // Переход к экрану результатов
                clearInterval(this.game.timerId);
            }

            if (this.game.seconds <= 0 && this.game.minutes > 0) {
                this.game.seconds = 59;
                this.game.minutes--;
            }
        }, 1000);
    }

    // Цикл отрисовки
    render() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.animationFrame++;

        // Обновляем игру
        if (!this.game.isPaused) {
            this.updateGame(deltaTime);
        }

        // Рисуем фоновый градиент
        const gradient = this.game.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8E8');
        this.game.ctx.fillStyle = gradient;
        this.game.ctx.fillRect(0, 0, this.width, this.height);

        // Рисуем облака
        this.game.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.clouds.forEach(cloud => {
            this.game.ctx.beginPath();
            this.game.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            this.game.ctx.arc(cloud.x + 25, cloud.y, cloud.size + 5, 0, Math.PI * 2);
            this.game.ctx.fill();
        });

        // Рисуем корзину
        if (this.basket) {
            this.basket.draw(this.game.ctx);
        }

        // Рисуем падающие числа
        this.fallingNumbers.forEach(number => {
            number.draw(this.game.ctx);
        });

        // Рисуем математический пример
        this.drawMathProblem();

        // Рисуем UI
        this.drawUI();
    }

    drawMathProblem() {
        if (!this.mathProblem) return;

        const problem = this.mathProblem.problem;
        this.game.ctx.font = 'bold 48px Arial';



        // Текст примера
        this.game.ctx.fillStyle = '#333';
        this.game.ctx.textAlign = 'left';
        this.game.ctx.textBaseline = 'top';
        this.game.ctx.fillText(problem, 180, 50);
    }

    drawUI() {

        if(this.game.seconds < 10)
        {
            this.seconds = '0' + this.game.seconds;
        }else{
            this.seconds = this.game.seconds
        }

        if(this.game.minutes < 10)
        {
            this.minutes = '0' + this.game.minutes;
        }else{
            this.minutes = this.game.minutes;
        }

        this.uiRenderer.render(
            this.game.ctx,
            this.game.uiManager.right,
            this.game.uiManager.wrong,
            this.game.uiManager.points,
            this.game.settings.width,
            this.game.settings.height,
            this.minutes,
            this.seconds,
            0
        );
    }

    handleKeyDown(){}

}