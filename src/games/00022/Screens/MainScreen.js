// MainScreen.js
import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import TextCard from "../../../base/Images/TextCard";
import UIRenderer from "../../../base/UI/UIRenderer";

export class MainScreen extends GameScreen {
    constructor(bgImg, game) {
        super();
        this.game = game;
        this.bg = bgImg;
        this.name = 'game';
        this.width = game.settings.width;
        this.height = game.settings.height;

        this.cards = [];
        this.expression = {};
        this.timer = null;

        this.snake = null;
        this.snakeSpeed = 0.5;
        this.snakeDirection = 'right';

        this.cardBg = new Image();
        this.cardBg.src = this.game.settings.path.img + 'cards/card.svg';
        this.uiRenderer = new UIRenderer();
        this.snakeLoopInterval = null;

    }

    initScene() {
        clearInterval(this.snakeLoopInterval);

        window.onkeydown = (e) => {
            this.handleKeyDown(e.key);
        };

        this.items = [];
        this.cards = [];

        if(this.bg){
            let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','bg',0,0,this.width,this.height,' ');
            this.items.push(bg);
        }

        if(this.hero){
            let hero = new BaseSprite( this.game.settings.path.img + this.hero.path,'hero','hero',this.hero.x,this.hero.y,this.hero.width,this.hero.height,' ');
            this.items.push(hero);
        }


        let btn = new BaseSprite(this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn','update',this.game.settings.width - 100,this.game.settings.height - 100,50,49,' ');
        this.items.push(btn);

        this.items.push(this.game.uiManager.ui.ok);
        this.items.push(this.game.uiManager.ui.wrong);
        this.items.push(this.game.uiManager.ui.coin);

        this.generateExpression();
        this.spawnAnswerOptions();
        this.createSnake();
        this.setTimer();
        this.moveSnakeLoop();
    }

    restart() {
        this.cards = [];
        this.items = this.items.filter(obj => obj.name !== "item");

        this.generateExpression();
        this.spawnAnswerOptions();
    }

    generateExpression() {
        const a = this.getRandomInt(1, 10);
        const b = this.getRandomInt(1, 10);
        this.expression = {
            question: `${a}+${b}=?`,
            answer: a + b
        };

        for(let i=0;i<this.expression.question.length;i++){
            let expressionItem = this.createTextCard(this.expression.question[i], 70*i, 50, 70, 70, 'black', 40, false);
            this.items.push(expressionItem);
        }

    }

    spawnAnswerOptions() {
        let values = new Set();
        values.add(this.expression.answer);
        while (values.size < 8) {
            values.add(this.getRandomInt(2, 20));
        }

        let i = 0;
        values = Array.from(values).sort(() => Math.random() - 0.5);
        for (let val of values) {
            const x = this.getRandomInt(0, 13);
            const y = this.getRandomInt(2, 9);
            let card = this.createTextCard(val, x*70, y*70, 70, 70, 'white', 40, true);
            card.value = val;
            this.items.push(card);
            this.cards.push(card);
        }
    }

    createTextCard(text, x, y, width, height, color, fontSize, canDrag) {
        const style = {
            size: fontSize.toString(),
            font: 'Arial',
            color1: 'black',
            color2: 'red',
            x: 30,
            xoffset: 10,
            xoffset2: 5,
            y: 50,
        };
        return new TextCard(
            '', 'item', 'text',
            x, y, width, height, text,
            false, canDrag,
            'card-canvas', this.cardBg, 1, style
        );
    }

    checkMouseMove(e){

    }

    createSnake() {
        this.snake = new BaseSprite(
            this.game.settings['path']['img'] + 'games/hero/smile.svg',
            'snake', 'snake',
            200, 300, 72, 72, ''
        );
        this.snake.canDrag = false;
        this.snake.isDraggable = false;
        this.items.push(this.snake);
    }

    moveSnakeLoop() {
        this.snakeLoopInterval = setInterval(() => {
            if (!this.isShow) return;

            let dx = 0, dy = 0;
            switch (this.snakeDirection) {
                case 'left': dx = -this.snakeSpeed; break;
                case 'right': dx = this.snakeSpeed; break;
                case 'up': dy = -this.snakeSpeed; break;
                case 'down': dy = this.snakeSpeed; break;
            }
            this.snake._x += dx;
            this.snake._y += dy;

            if(this.snake._x <= 0){
                this.snakeDirection = 'right';
            }

            if(this.snake._x >= this.game.settings.width - 70){
                this.snakeDirection = 'left';
            }

            if(this.snake._y <= 0){
                this.snakeDirection = 'down';
            }

            if(this.snake._y >= this.game.settings.height - 70){
                this.snakeDirection = 'up';
            }

            for (let i = 0; i < this.cards.length; i++) {
                if (this.game.helper.isIntersect(this.snake, this.cards[i], 10)) {
                    const card = this.cards[i];
                    if (parseInt(card.value) === this.expression.answer) {
                        this.game.uiManager.right++;
                        this.game.uiManager.points += 10;
                    } else {
                        this.game.uiManager.wrong++;
                    }
                    this.restart();
                    break;
                }
            }
        }, 0);
    }

    handleKeyDown(key) {
        switch (key) {
            case 'ArrowLeft': this.snakeDirection = 'left'; break;
            case 'ArrowRight': this.snakeDirection = 'right'; break;
            case 'ArrowUp': this.snakeDirection = 'up'; break;
            case 'ArrowDown': this.snakeDirection = 'down'; break;
        }
    }


    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setTimer(){

        this.game.minutes = this.game.settings.time.all;

        clearInterval(this.game.timerId);

        this.game.timerId = setInterval(() => {

            if(!this.game.isPaused){
                this.game.seconds--;
            }

            if(this.game.minutes === 0 && this.game.seconds === 0) {
                this.game.showScreen(1,2);
                clearInterval(this.game.timerId);

            }

            if(this.game.seconds <= 0 && this.game.minutes > 0)
            {
                this.game.seconds = 59;
                this.game.minutes--;
            }

        }, 1000);


    }

    render(){

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

    }

}