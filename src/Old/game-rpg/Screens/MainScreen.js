import GameScreen from '../../../base/Screens/GameScreen'
import BaseSprite from '../../../base/Images/BaseSprite'
import CardManager from '../../../base/Manager/CardManager'
import TextCardManager from '../../../base/Manager/TextCardManager'
import Camera from "../../../base/Camera/Camera";


// основной класс игры
export default class MainScreen extends GameScreen{
		
    constructor(bgImg, game, width = 800, height = 600){
        super();

        this.map = [
            [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],
            [0,1,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,1,2],
            [0,1,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0],
            [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0],
            [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0],
            [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
        
        this.basket = [];
        this.width = width;
        this.height = height;
        this.game = game;
        this.game.minutes = game.settings['minutes'];
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();

        this.camera = new Camera();

        this.dirX = 0;
        this.dirY = 0;

    }

    initScene(){

        this.drawMap();
        
    }

    drawMap(){

        this.items = [];

        this.camera.x = this.camera.x + this.dirX * this.camera.speed;
        this.camera.y = this.camera.y + this.dirY * this.camera.speed;

        if(this.camera.x > 19 * 64){
            this.camera.x = 19 * 64;
        }

        if(this.camera.x < 0){
            this.camera.x = 0;
        }

        if(this.camera.y > 19 * 64){
            this.camera.y = 19 * 64;
        }

        if(this.camera.y < 0){
            this.camera.y = 0;
        }

        console.log(this.camera.x, this.dirX);

        let startCol = Math.floor(this.camera.x / 64);
        let endCol = startCol + (this.camera.width / 64);
        let startRow = Math.floor(this.camera.y / 64);
        let endRow = startRow + (this.camera.height / 64);

        let offsetX = -this.camera.x + startCol * 64;
        let offsetY = -this.camera.y + startRow * 64;

        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {

                let tileType = this.map[c][r] ?? 100;
                let x = (c - startCol) * 64 + offsetX;
                let y = (r - startRow) * 64 + offsetY;

                if (tileType !== 100) {
                    let tile = new BaseSprite(this.game.settings['game_path']['img'] + 'tiles/tile-'+tileType+'.png','tile-'+c+r,'terrain',x,y,64,64,0);
                    this.items.push(tile);
                }
            }
        }

    }

    checkMouseClick(e){

    }

    checkMouseUp(e){

    }

    checkMouseMove(e){
        console.log(e.clientX, e.clientY);
        //console.log(this.offsetX, this.offsetY);

        this.dirX = 0;
        this.dirY = 0;

        if(e.clientX > 590){
            this.dirX = 1;
        }

        if(e.clientX < 70){
            this.dirX = -1;
        }

        if(e.clientY > 590){
            this.dirY = 1;
        }

        if(e.clientY < 70){
            this.dirY = -1;
        }


    }


    // цикл отрисовки
    render(){

        this.drawMap();
        this.game.ctx.fillStyle = "#111";
        this.game.ctx.font = "20pt Arial";
        this.game.ctx.fillText(this.game.uiManager.right , 600, 50);
        this.game.ctx.fillText(this.game.uiManager.wrong , 700, 50);
        this.game.ctx.fillText(this.game.uiManager.points , 400, 50);
        
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
            
            this.game.ctx.fillText(this.minutes + ':' + this.seconds , 30, 50);
        
    }

}