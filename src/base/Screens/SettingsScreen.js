import GameScreen from './GameScreen';
import ColorfulButton from '../UI/ColorfulButton';
import BaseSprite from '../Images/BaseSprite';
import ScenePositionerVertical from "../Utils/ScenePositionerVertical";
import ColorfulText from "../UI/ColorfulText";
import Translation from "../Translations/Translation";
import gsap from "gsap";

export default class SettingsScreen extends GameScreen {

    constructor(bgImg, game, hero, title, options, nextScreen = 2) {
        super();

        this.options = options;
        this.nextScreen = nextScreen;
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.game = game;
        this.hero = hero;
        this.bg = bgImg;
        this.title = title ?? '';
        this.titleX = 80;
        this.titleY = (game.settings.height / 2) - 100;
        this.centerX = (this.game.settings.width / 2) - 200;
        this.centerY = 150;
        this.baseFontSize = 24;
        this.fontSize = 24;
        this.name = 'settings';
        this.translation = new Translation()
    }

    initScene() {
        this.items = [];

        let bg = new BaseSprite(this.game.settings.path.img + this.bg, 'bg', 'win', 0, 0, this.width, this.height, ' ');
        this.items.push(bg);

        let arrow = new BaseSprite(this.game.settings.path.img + 'win/arrow.svg','arrow','win',200,200,90,91,' ');


        if(this.hero){
            let hero = new BaseSprite( this.game.settings.path.img + this.hero.path,'hero','hero',this.hero.x,this.hero.y,this.hero.width,this.hero.height,' ');
            this.items.push(hero);
            this.tweens['tweenHero'] = gsap.to(hero, {_y : this.game.getScaled(hero._y - 50), duration : 3, repeat: -1, yoyo:true});
        }

        this.items.push(arrow);

        const scenePositioner = new ScenePositionerVertical(
            this.game.getScaled(this.centerX),
            this.game.getScaled(this.centerY),
            120,
            this.game.getScaled(95),
            this.options.length
        );


        const rainbowText = new ColorfulText('rainbow', 400, 70, this.translation.make(this.game.settings.lang, 'choose variant'), {
            fontSize: 36,
            fontWeight: 'bold',
            pulse: true,
            pulseMin: 0.8,
            pulseMax: 1.2
        });

        this.items.push(rainbowText);

        for (let i = 0; i < this.options.length; i++) {
            let coords = scenePositioner.getCoords(i);

            let btn = new ColorfulButton(
                'options-btn',
                coords.x,
                coords.y,
                this.options[i].title,
                '#66ccff',  // голубой
                '#00ddff',  // голубой светлый при наведении
                this.options[i].value
            );

            this.items.push(btn);
        }

        this.tweens['tweenArrowWin'] = gsap.to(arrow, {_y : this.game.getScaled(250), duration : 1, repeat: -1, yoyo:true});

        this?.scale(this.game.scale);
    }

    checkMouseMove(e) {
        for (let item of this.items) {
            if (item.name === 'options-btn' && typeof item.checkMouseMove === 'function') {
                item.checkMouseMove(e);
            }
        }
    }

    checkMouseClick(e) {
        if (typeof (e) === 'undefined') return;
        if (!this.isShow) return;

        for (let item of this.items) {
            if (item.name === 'options-btn' &&
                typeof item.isClick === 'function' &&
                item.isClick(e) &&
                item.isShow) {

                console.log(this.game.screens[this.nextScreen])
                this.game.settings?.options.push(item.value);

                setTimeout(() => {
                    this.game.screens[this.nextScreen].initScene();
                    this.game.showScreenByKey(this.nextScreen);
                }, 10);

                e.preventDefault();
                return;
            }
        }
    }

    render() {
        let scenePositioner = new ScenePositionerVertical(
            this.game.getScaled(this.centerX),
            this.game.getScaled(this.centerY),
            0,
            this.game.getScaled(75),
            this.options.length
        );

        this.game.ctx.fillStyle = "#fff";
        this.game.ctx.font = (this.fontSize).toString() + "pt Arial";

    }
}
