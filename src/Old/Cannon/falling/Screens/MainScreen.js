/*  Canon Math – the game itself  */
import GameScreen            from '../../../base/Screens/GameScreen.js';
import BaseSprite            from '../../../base/Images/BaseSprite.js';
import TextCard              from '../../../base/Images/TextCard.js';
import UIRenderer            from '../../../base/UI/UIRenderer.js';
import MathProblem           from '../../../base/PlayLogic/MathProblem.js';

export class MainScreen extends GameScreen {
    constructor(bgImg, game, hero) {
        super();
        this.game  = game;
        this.bg    = bgImg;
        this.hero  = hero;
        this.name  = 'game';

        this.width  = game.settings.width;
        this.height = game.settings.height;

        this.uiRenderer = new UIRenderer();
        this.cardBg     = new Image();
        this.cardBg.src = game.settings.path.img + 'cards/card.svg';

        /* game state */
        this.lives        = 3;
        this.score        = 0;
        this.bullets      = [];   // {x,y,dy}
        this.targets      = [];   // TextCard sprites
        this.cannon       = null; // BaseSprite
        this.problem      = new MathProblem('easy');
        this.expressionSprites = []; // TextCards for the expression

        this.loop         = null; // main RAF id
        this.lastSpawn    = 0;    // timestamp
        this.spawnEvery   = 2000; // ms
    }

    /* -------------------------------------------------- */
    initScene() {
        this.items.length = 0;
        this.bullets.length = 0;
        this.targets.length = 0;
        this.lives = 3;
        this.score = 0;

        /* background */
        if (this.bg) {
            this.items.push(new BaseSprite(
                this.game.settings.path.img + this.bg,
                'bg', 'bg', 0,0, this.width, this.height, ' '
            ));
        }

        /* hero (purely decorative) */
        if (this.hero) {
            this.items.push(new BaseSprite(
                this.game.settings.path.img + this.hero.path,
                'hero','hero',
                this.hero.x, this.hero.y, this.hero.width, this.hero.height, ' '
            ));
        }

        /* cannon */
        this.cannon = new BaseSprite(
            this.game.settings.path.img + 'hero/circle.svg',
            'cannon','cannon',
            this.width/2 -35, this.height - 100, 70,70,' '
        );
        this.items.push(this.cannon);

        /* UI buttons – none needed, we use keyboard/tap */

        this.generateExpression();
        this.setTimer();
        this.startLoop();
    }

    /* -------------------------------------------------- */
    generateExpression() {
        /* remove old expression sprites */
        this.expressionSprites.forEach(s => {
            const idx = this.items.indexOf(s);
            if (idx > -1) this.items.splice(idx,1);
        });
        this.expressionSprites.length = 0;

        this.problem.generate();
        const text = this.problem.problem;
        for (let i = 0; i < text.length; i++) {
            const card = this.createTextCard(
                text[i], 20 + i*40, 20, 40,50, 'black', 30, false
            );
            this.items.push(card);
            this.expressionSprites.push(card);
        }
    }

    /* -------------------------------------------------- */
    spawnTargets() {
        if (this.targets.length) return; // wait until empty

        const correct = this.problem.answer;
        const values  = new Set([correct]);

        while (values.size < 5) {
            values.add(this.game.helper.getRandomInt(1,20));
        }
        const arr = [...values].sort(() => Math.random() - .5);

        arr.forEach((val, idx) => {
            const card = this.createTextCard(
                val,
                100 + idx * (this.width/5), 120,  // x,y
                70,70, 'white', 40, true
            );
            card.value   = val;
            card.vy      = (Math.random() * 0.5 + 0.5) * (this.game.scale || 1); // downward speed
            this.targets.push(card);
            this.items.push(card);
        });
    }

    /* -------------------------------------------------- */
    createTextCard(text, x, y, w, h, color, fontSize, canDrag) {
        return new TextCard(
            '', 'target', 'text',
            x, y, w, h, text,
            false, canDrag,
            'card-canvas', this.cardBg, 1,
            {
                size: fontSize.toString(),
                font: 'Arial',
                color1: color,
                color2: 'red',
                color3: 'green',
                x: w/2-10,
                xoffset: 10,
                xoffset2: 5,
                y: h/2+10
            }
        );
    }

    /* -------------------------------------------------- */
    startLoop() {
        if (this.loop) cancelAnimationFrame(this.loop);
        const step = (t) => {
            if (!this.isShow) return;
            this.update(t);
            this.loop = requestAnimationFrame(step);
        };
        this.loop = requestAnimationFrame(step);
    }

    /* -------------------------------------------------- */
    update(now) {
        /* spawn new wave if needed */
        if (!this.targets.length && now - this.lastSpawn > this.spawnEvery) {
            this.spawnTargets();
            this.lastSpawn = now;
        }

        /* move targets downward */
        this.targets.forEach(t => {
            t._y += t.vy;
            if (t._y > this.height) {
                /* missed – remove */
                const idx = this.targets.indexOf(t);
                this.targets.splice(idx,1);
                const iidx = this.items.indexOf(t);
                if (iidx > -1) this.items.splice(iidx,1);
            }
        });

        /* move bullets upward */
        this.bullets.forEach((b, idx) => {
            b.y -= b.dy;
            if (b.y < 0) {
                this.bullets.splice(idx,1);
                return;
            }

            /* collision with targets */
            this.targets.forEach(t => {
                if (this.game.helper.isIntersect(
                    {_x:b.x, _y:b.y, _iwidth:10, _iheight:20},
                    {_x:t._x, _y:t._y, _iwidth:t._width, _iheight:t._height}, 0)) {

                    /* hit! */
                    if (t.value === this.problem.answer) {
                        this.score++;
                        this.game.uiManager.right++;
                        this.game.uiManager.points = this.score * 10;
                    } else {
                        this.lives--;
                        this.game.uiManager.wrong++;
                    }

                    /* tidy arrays */
                    this.targets.splice(this.targets.indexOf(t),1);
                    const ii = this.items.indexOf(t);
                    if (ii>-1) this.items.splice(ii,1);

                    this.bullets.splice(idx,1);

                    /* new expression */
                    this.generateExpression();
                    this.lastSpawn = now - this.spawnEvery; // force next wave
                }
            });
        });

        if (this.lives <= 0) this.endGame();
    }

    /* -------------------------------------------------- */
    shoot() {
        this.bullets.push({
            x: this.cannon._x + 35,
            y: this.cannon._y,
            dy: 10 * (this.game.scale || 1)
        });
    }

    /* -------------------------------------------------- */
    handleKeyDown(key) {
        const step = 30 * (this.game.scale || 1);
        if (key === 'ArrowLeft')  this.cannon._x = Math.max(0, this.cannon._x - step);
        if (key === 'ArrowRight') this.cannon._x = Math.min(this.width-70, this.cannon._x + step);
        if (key === ' ') this.shoot();
    }

    /* -------------------------------------------------- */
    checkMouseClick(e) {
        if (typeof e === 'undefined') return;
        /* mobile tap = shoot */
        this.shoot();
    }

    /* -------------------------------------------------- */
    setTimer() {
        this.game.minutes = this.game.settings.time.all;
        this.game.seconds = 0;
        clearInterval(this.game.timerId);

        this.game.timerId = setInterval(() => {
            if (!this.game.isPaused) {
                this.game.seconds--;
                if (this.game.seconds < 0 && this.game.minutes > 0) {
                    this.game.seconds = 59;
                    this.game.minutes--;
                }
                if (this.game.minutes === 0 && this.game.seconds === 0) {
                    this.endGame();
                }
            }
        }, 1000);
    }

    /* -------------------------------------------------- */
    endGame() {
        clearInterval(this.game.timerId);
        cancelAnimationFrame(this.loop);
        this.game.showScreen(1, 2); // jump to ResultScreen
    }

    /* -------------------------------------------------- */
    render() {
        /* draw bullets */
        this.game.ctx.fillStyle = '#ffcc00';
        this.bullets.forEach(b => {
            this.game.ctx.fillRect(b.x, b.y, 10, 20);
        });

        /* UI */
        this.uiRenderer.render(
            this.game.ctx,
            this.game.uiManager.right,
            this.game.uiManager.wrong,
            this.score * 10,
            this.width, this.height,
            this.game.minutes,
            this.game.seconds,
            0
        );

        /* lives */
        this.game.ctx.fillStyle = '#fff';
        this.game.ctx.font = '24px Arial';
        this.game.ctx.fillText('❤️'.repeat(this.lives), 20, this.height - 20);
    }
}