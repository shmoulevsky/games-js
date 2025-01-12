import GameScreen from './GameScreen'
import BaseSprite from '../Images/BaseSprite'
import ScenePositionerVertical from "../Utils/ScenePositionerVertical";

// основной класс игры
export default class SettingsScreen extends GameScreen{
		
    constructor(bgImg, game, title, options, nextScreen = 2){
        super();

        this.options = options;
        this.nextScreen = nextScreen;
        this.width = game.settings.width;
        this.height = game.settings.height;
        this.game = game;
        this.bg = bgImg;
        this.title = title ?? '';
        this.titleX = 80;
        this.titleY = (game.settings.height / 2) - 50;
        this.centerX = (this.game.settings.width / 2) - 200;
        this.centerY = 100;
        this.baseFontSize = 24;
        this.fontSize = 24;
        this.name = 'settings';

    }

    initScene(){

        this.items = [];

        let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','win',0,0,this.width,this.height,' ');
        this.items.push(bg);



        let scenePositioner = new ScenePositionerVertical(this.game.getScaled(this.centerX), this.game.getScaled(this.centerY),0,this.game.getScaled(75),this.options.length);

        for (let i = 0; i < this.options.length; i++) {

            let coords = scenePositioner.getCoords(i);
            let btn = new BaseSprite(
                this.game.settings.path.img + 'settings/settings-btn.svg',
                'options-btn',
                'options-btn',
                coords.x,
                coords.y,
                191,
                68,
                this.options[i].value
            );
            this.game.scale;
            this.items.push(btn);
        }

        this?.scale(this.game.scale);
    }

    checkMouseMove(e){

    }


    checkMouseClick(e){
		
        if(typeof(e) == 'undefined') return;
        if(!this.isShow) return;

        for(let i=0;i<this.items.length;i++){
                        
            if(this.items[i].name === 'options-btn' &&
                this.game.helper.isClick(e, this.items[i]) && 
                this.items[i].isShow){

                    this.game.screens[this.nextScreen].initScene();

                    setTimeout(() => {
                        this.game.showScreen(1, this.nextScreen);
                        this.game.settings.range = this.items[i].value;
                    }, 10);

                    e.preventDefault();
                    return;
            }
        }
       
    }

    
    // цикл отрисовки
    render(){

        let scenePositioner = new ScenePositionerVertical(this.game.getScaled(this.centerX), this.game.getScaled(this.centerY),0,this.game.getScaled(75),this.options.length);
        this.game.ctx.fillStyle = "#fff";
        this.game.ctx.font = (this.fontSize).toString()+"pt Arial"

        for (let i = 0; i < this.options.length; i++) {
            let coords = scenePositioner.getCoords(i);
            this.game.ctx.fillText(this.options[i].title , this.game.getScaled(coords.x + 20), this.game.getScaled(coords.y + 45));
        }


        
    }

}