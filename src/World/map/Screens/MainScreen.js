import GameScreen from './../../../base/Screens/GameScreen'
import BaseSprite from './../../../base/Images/BaseSprite'
import CardManager from './../../../base/Manager/CardManager'
import Card from "../../../base/Images/Card";
import gsap from "gsap";
import Camera from "../../../base/Camera/Camera";
import World from "../../../base/World/World";

// основной класс игры
export default class MainScreen extends GameScreen{
		
    constructor(bgImg, game, width = 800, height = 600){
        super();
        this.basket = [];
        this.width = width;
        this.height = height;
        this.game = game;
        this.game.isPaused = false;
        this.bg = bgImg;
        this.cardManager = new CardManager();
        this.camera = new Camera();
        this.world = new World();

        this.world.offsetX = document.getElementById('game-canvas').offsetLeft;
        this.world.offsetY = document.getElementById('game-canvas').offsetTop;

        this.camera.speed = 5;
        this.game.settings.cellSize = 40;
        this.game.settings.cellScale = 1;
        this.game.settings.mouseOffset = 100;

    }

    initScene(){
        this.prepareRound();

        window.onkeydown = (e) => {

            this.camera.clear();

            //left
            if(e.key === 'ArrowLeft' && this.camera.x < 0) {
                this.camera.moveLeft();
            }

            //right
            if(e.key === 'ArrowRight' && this.camera.x > (this.width-this.world.width+this.game.settings.mouseOffset)) {
                this.camera.moveRight();
            }

            //down
            if(e.key === 'ArrowDown' && this.camera.y > (this.height-this.world.height+this.game.settings.mouseOffset)) {
                this.camera.moveDown();
            }

            //up
            if(e.key === 'ArrowUp' && this.camera.y < 0) {
                this.camera.moveUp();
            }

            if(!this.camera.isMove) return;

            for(let i=0;i<this.items.length;i++){
                this.items[i]._x = this.items[i]._x + this.camera.speedX;
                this.items[i]._y = this.items[i]._y + this.camera.speedY;
            }

        };



    }

    prepareRound()
    {
        this.items = [];

        if(this.bg){
            let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','bg',0,0,this.world.width,this.world.height,' ');
            this.items.push(bg);
        }

        let btn = new BaseSprite(this.game.settings.path.img + 'ui/update-btn-short.svg',
            'update-btn','update',730,533,50,49,' ');
        this.items.push(btn);



    }

    makeField(){
        for (let i = 0; i < this.field.sizeX; i++) {
            for (let j = 0; j < this.field.sizeY; j++) {
                let card = new Card(
                    this.game.settings.path.img + 'games/map/cards.svg',
                    'field-'+i,
                    'field',
                    i*(this.game.settings.cellSize) + 30,
                    j*(this.game.settings.cellSize) + 80,
                    this.game.settings.cellSize,
                    this.game.settings.cellSize,
                    i+j,
                    false,
                    false,
                    5
                );
                card.positionX = i;
                card.positionY = j;
                card.pos = 0;
                this.field.items.push(card);
                this.items.push(card);
            }
        }
    }

    makeCell(name, pos, positionX, positionY){

        let cell = new Card(
            this.game.settings.path.img + 'games/map/cards.svg',
            name,
            pos,
            positionX * (this.game.settings.cellSize) + 30,
            positionY * (this.game.settings.cellSize) + 80,
            this.game.settings.cellSize,
            this.game.settings.cellSize,
            1,
            false,
            false,
            4
        );
        cell.pos = pos;
        cell.positionX = positionX;
        cell.positionY = positionY;
        cell.setScale(this.game.settings.cellScale);
        this.items.push(cell);
        return cell;
    }



    checkMouseMove(e){

        this.camera.mouse.x = e.clientX - this.world.offsetX;
        this.camera.mouse.y = e.clientY - this.world.offsetY;
    }



    checkMouseClick(e){

        for(let i=0;i<this.items.length;i++){

            if(this.items[i].type === 'field' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){

            }

        }

    }

    checkMouseUp(e){

    }

    checkMouse() {

        this.camera.clear();

        //left
        if(this.camera.mouse.x < this.game.settings.mouseOffset && this.camera.x < 0) {
            this.camera.moveLeft();
        }

        //right
        if(this.camera.mouse.x > this.width - this.game.settings.mouseOffset && this.camera.x > (this.width-this.world.width+this.game.settings.mouseOffset)) {
            this.camera.moveRight();
        }

        //down
        if(this.camera.mouse.y > this.height - this.game.settings.mouseOffset && this.camera.y > (this.height-this.world.height+this.game.settings.mouseOffset)) {
            this.camera.moveDown();
        }

        //up
        if(this.camera.mouse.y < this.game.settings.mouseOffset && this.camera.y < 0) {
            this.camera.moveUp();
        }

        if(!this.camera.isMove) return;

        for(let i=0;i<this.items.length;i++){
            this.items[i]._x = this.items[i]._x + this.camera.speedX;
            this.items[i]._y = this.items[i]._y + this.camera.speedY;
        }

    }

    // цикл отрисовки
    render(){
        this.checkMouse();
        this.game.ctx.fillStyle = "#111";
        this.game.ctx.font = "18pt Arial";
        this.game.ctx.fillText(this.items[0]._x , 600, 50);
        this.game.ctx.fillText(this.items[0]._y , 700, 50);

        this.game.ctx.fillText('camX: ' + this.camera.x , 100, 50);
        this.game.ctx.fillText('camY: ' + this.camera.y , 240, 50);

    }
}