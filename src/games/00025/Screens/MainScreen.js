// MainScreen.js
import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import TextCard from "../../../base/Images/TextCard";
import UIRenderer from "../../../base/UI/UIRenderer";
import MathProblem from "../../../base/PlayLogic/MathProblem";
import Airplane from "../../components/Airplane";
import Cloud from "../../components/Cloud";


export class MainScreen extends GameScreen {
    constructor(bgImg, game) {
        super();
        this.game = game;
        this.bg = bgImg;
        this.name = 'game';
        this.width = game.settings.width;
        this.height = game.settings.height;

        this.airplane = null;
        this.clouds = [];
        this.mathProblem = null;

        this.cloudSpawnTimer = 0;
        this.cloudSpawnInterval = 180; // Интервал появления облаков (в кадрах)
        this.correctAnswerSpawned = false;

        this.cardBg = new Image();
        this.cardBg.src = this.game.settings.path.img + 'cards/card-transparent.svg';
        this.uiRenderer = new UIRenderer();
        this.gameLoopInterval = null;

        this.gameSpeed = 16; // 60 FPS
    }

    initScene() {

        window.onkeydown = (e) => {
            this.handleKeyDown(e.key);
        };

        clearInterval(this.gameLoopInterval);
        this.items = [];
        this.clouds = [];
        this.expressionCards = [];
        this.correctAnswerSpawned = false;

        // Фон
        if(this.bg) {
            let bg = new BaseSprite(this.game.settings.path.img + 'bg/sky/sky.svg', 'bg', 'bg', 0, 0, this.width, this.height, ' ');
            this.items.push(bg);
        }

        // Кнопка обновления
        let btn = new BaseSprite(this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn', 'update', this.game.settings.width - 100, this.game.settings.height - 100, 50, 49, ' ');
        this.items.push(btn);

        // UI элементы
        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);

        this.createAirplane();
        this.generateNewProblem();
        this.setTimer();
        this.startGameLoop();
    }

    createAirplane() {
        // Используем изображение круга как самолёт (можно заменить на airplane.svg)
        this.airplane = new Airplane(
            this.game.settings.path.img + 'games/airplane/plane.svg',
            'airplane', 'airplane',
            50, 350, 106,62, ''
        );
        this.airplane.canDrag = false;
        this.airplane.isDraggable = false;
        this.items.push(this.airplane);
    }

    generateNewProblem() {
        // Удаляем старые карточки с примером
        this.items = this.items.filter(item => item.type !== 'expression');

        this.correctAnswerSpawned = false;
        // Создаём новый пример
        this.mathProblem = new MathProblem(this.game.settings.options[1], this.game.settings.options[0]);

    }

    spawnCloud() {
        const cloudY = this.getRandomInt(150, 500);
        const cloudX = this.width + 50;

        // Выбираем число для облака
        let cloudNumber;

        // Если правильный ответ ещё не появлялся и прошло достаточно времени
        if (!this.correctAnswerSpawned && Math.random() < 0.4) {
            cloudNumber = this.mathProblem.answer;
            this.correctAnswerSpawned = true;
        } else {
            cloudNumber = this.generateWrongAnswer();
        }

        // Создаём облако (используем карточку как основу)
        const cloud = new Cloud(
            this.game.settings.path.img + 'games/airplane/cloud.svg',
            'cloud', 'cloud',
            cloudX, cloudY, 87,60, '', cloudNumber
        );

        // Создаём текст с числом на облаке
        const numberCard = this.createTextCard(cloudNumber.toString(), cloudX + 15, cloudY + 15, 50, 50, 'transparent', 28, false);
        numberCard.type = 'cloud-number';

        cloud.setNumberCard(numberCard);

        this.clouds.push(cloud);
        this.items.push(cloud);
        this.items.push(numberCard);
    }

    generateWrongAnswer() {
        const correctAnswer = this.mathProblem.answer;
        let wrongAnswer;
        const attempts = 5;

        for(let i = 0; i < attempts; i++) {
            wrongAnswer = this.getRandomInt(Math.max(1, correctAnswer - 8), correctAnswer + 8);
            if (wrongAnswer !== correctAnswer) {
                break;
            }
        }

        return wrongAnswer;
    }

    createTextCard(text, x, y, width, height, bgColor, fontSize, canDrag) {
        const style = {
            size: fontSize.toString(),
            font: 'Arial',
            color1: 'black',
            color2: 'red',
            color3: 'green',
            x: Math.floor(width/3),
            xoffset: 0,
            xoffset2: 3,
            y: Math.floor(height * 0.7),
        };

        if (bgColor === 'transparent') {
            // Для чисел на облаках создаём карточку без фона
            style.color1 = '#000000';
            style.x = 0;
            style.y = 20;
        }

        return new TextCard(
            '', 'text-card', 'text',
            x, y, width, height, text,
            false, canDrag,
            'card-canvas', this.cardBg, 1, style
        );
    }

    startGameLoop() {
        this.gameLoopInterval = setInterval(() => {
            if (!this.isShow) return;
            this.updateGame();
        }, this.gameSpeed);
    }

    updateGame() {
        // Обновляем самолёт
        if (this.airplane) {
            this.airplane.update();
        }

        // Обновляем облака
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            const cloud = this.clouds[i];
            cloud.update();

            // Проверяем столкновение с самолётом
            if (this.game.helper.isIntersect(this.airplane, cloud, 15)) {
                this.checkAnswer(cloud.number);
                this.removeCloud(i);
                continue;
            }

            // Удаляем облака, которые улетели за экран
            if (cloud.isOffScreen()) {
                this.removeCloud(i);
            }
        }

        // Спавним новые облака
        this.cloudSpawnTimer++;
        if (this.cloudSpawnTimer >= this.cloudSpawnInterval) {
            this.spawnCloud();
            this.cloudSpawnTimer = 0;
            // Случайный интервал для следующего облака
            this.cloudSpawnInterval = this.getRandomInt(120, 240);
        }

        // Если правильный ответ не появился долго, принудительно создаём его
        if (!this.correctAnswerSpawned && this.cloudSpawnTimer > 60) {
            this.cloudSpawnTimer = this.cloudSpawnInterval;
        }
    }

    removeCloud(index) {
        const cloud = this.clouds[index];

        // Удаляем облако из items
        this.items = this.items.filter(item => item !== cloud);

        // Удаляем карточку с числом
        if (cloud.numberCard) {
            this.items = this.items.filter(item => item !== cloud.numberCard);
        }

        // Удаляем из массива облаков
        this.clouds.splice(index, 1);
    }

    checkAnswer(answer) {
        if (this.mathProblem.check(answer)) {
            // Правильный ответ
            this.game.uiManager.right++;
            this.game.uiManager.points += 10;

            // Анимация успеха
            this.game.uiManager.tweens['ok'].play();
            this.game.uiManager.tweens['ok'].restart();


            // Генерируем новый пример через небольшую задержку
            setTimeout(() => {
                this.generateNewProblem();
            }, 500);

        } else {
            // Неправильный ответ
            this.game.uiManager.wrong++;

            // Анимация ошибки
            this.game.uiManager.tweens['wrong'].play();
            this.game.uiManager.tweens['wrong'].restart();


        }
    }

    handleKeyDown(key) {
        if (!this.airplane) return;

        switch (key) {
            case 'ArrowUp':
                this.airplane.moveUp();
                break;
            case 'ArrowDown':
                this.airplane.moveDown();
                break;
            case 'ArrowLeft':
                this.airplane.moveLeft();
                break;
            case 'ArrowRight':
                this.airplane.moveRight();
                break;
        }
    }

    checkMouseClick(e) {
        if (typeof(e) === 'undefined') return;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === 'update-btn' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow) {
                this.restart();
                break;
            }
        }
    }

    checkMouseMove(e) {
        // Дополнительно можно реализовать управление мышью
        if (this.airplane && e) {
            const mouseY = e.pageY - e.target.offsetTop;
            if (mouseY > 120 && mouseY < 580) {
                this.airplane.targetY = mouseY;
            }
        }
    }

    restart() {
        // Очищаем облака
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            this.removeCloud(i);
        }

        // Сбрасываем таймеры
        this.cloudSpawnTimer = 0;
        this.cloudSpawnInterval = 180;
        this.correctAnswerSpawned = false;

        // Генерируем новый пример
        this.generateNewProblem();

        // Возвращаем самолёт в исходную позицию
        if (this.airplane) {
            this.airplane._x = 150;
            this.airplane._y = 350;
            this.airplane.targetY = 350;
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
                this.game.showScreen(1, 2);
                clearInterval(this.game.timerId);
                clearInterval(this.gameLoopInterval);
            }

            if (this.game.seconds <= 0 && this.game.minutes > 0) {
                this.game.seconds = 59;
                this.game.minutes--;
            }
        }, 1000);
    }

    render() {
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

        // Форматирование времени для отображения
        this.seconds = this.game.seconds < 10 ? '0' + this.game.seconds : this.game.seconds;
        this.minutes = this.game.minutes < 10 ? '0' + this.game.minutes : this.game.minutes;

        // Draw math expression
        this.game.ctx.fillStyle = "#FFD700";
        this.game.ctx.font = "bold 32px Arial";
        this.game.ctx.strokeStyle = "#8B4513";
        this.game.ctx.lineWidth = 3;
        this.game.ctx.strokeText(this.mathProblem.problem, 150, 70);
        this.game.ctx.fillText(this.mathProblem.problem, 150, 70);

    }
}