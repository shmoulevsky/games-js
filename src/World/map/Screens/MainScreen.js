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
        this.camera.x = parseInt(localStorage.getItem('cameraX')) || -635;
        this.camera.y = parseInt(localStorage.getItem('cameraY'))|| -725;
        this.camera.mouse.x = parseInt(localStorage.getItem('mouseX'))|| 0;
        this.camera.mouse.y = parseInt(localStorage.getItem('mouseY'))|| 0;

        this.world = new World('world-canvas');

        this.camera.speed = 5;
        this.game.settings.cellSize = 40;
        this.game.settings.cellScale = 1;
        this.game.settings.mouseOffset = 130;

    }

    initScene(){
        this.prepareRound();

        let backBtn = document.getElementById("back-map");

        backBtn.addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('game-canvas').style.display = 'none';
            this.world.show();
        });

        document.body.addEventListener('mousemove', (e) => {

            this.camera.isStoped = false;
            if(e.target.id !== 'world-canvas'){
                this.camera.isStoped = true;
            }

        })

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
            this.moveItems();
        };

    }

    prepareRound()
    {
        this.items = [];

        if(this.bg){
            let bg = new BaseSprite( this.game.settings.path.img + this.bg,'bg','bg',0,0,this.world.width,this.world.height,' ');
            this.items.push(bg);
        }

        this.setPoints();

        for(let i=0;i<this.items.length;i++){
            this.items[i]._x = this.items[i]._x + this.camera.x;
            this.items[i]._y = this.items[i]._y + this.camera.y;
        }

    }

    setPoints(){

        let points = [
            {x : 730, y : 530, width : 50 , height : 50, img : 'ui/update-btn-short.svg', url : '/js/games/quicksort/figurs/bundle.js'},
            {x : 760, y : 600, width : 50 , height : 50, img : 'ui/update-btn-short.svg', url : '/js/games/memory/pair/bundle.js'},
        ]

        for (let key in points){

            let point = new BaseSprite(
                this.game.settings.path.img + points[key].img,
                'point-' + key,
                'point',
                points[key].x,
                points[key].y,
                points[key].width,
                points[key].height,
                key);

            point.gameUrl = points[key].url;
            this.items.push(point);
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
        this.camera.mouse.target = e.target;
    }

    checkMouseClick(e){

        for(let i=0;i<this.items.length;i++){

            if(this.items[i].type === 'field' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){

            }

            if(this.items[i].type === 'point' &&
                this.game.helper.isClick(e, this.items[i]) &&
                this.items[i].isShow){

                let script = document.createElement("script");
                script.setAttribute("src", this.items[i].gameUrl);
                script.setAttribute("type","text/javascript");
                document.body.appendChild(script);
                this.world.hide();

                script.addEventListener("load",()=>{
                    document.getElementById('game-canvas').style.display = 'block';
                });

            }

        }

    }

    checkMouseUp(e){

    }

    checkMouse() {

        if(this.camera.isStoped) return;

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
        if(this.camera.mouse.y > this.height - this.game.settings.mouseOffset
            && this.camera.y > (this.height-this.world.height+this.game.settings.mouseOffset)
        ) {
            this.camera.moveDown();
        }

        //up
        if(this.camera.mouse.y < this.game.settings.mouseOffset && this.camera.y < 0) {
            this.camera.moveUp();
        }

        if(!this.camera.isMove) return;

        localStorage.setItem('mouseX', this.camera.mouse.x);
        localStorage.setItem('mouseY', this.camera.mouse.y);
        this.moveItems();

    }

    moveItems(){
        for(let i=0;i<this.items.length;i++){
            this.items[i]._x = this.items[i]._x + this.camera.speedX;
            this.items[i]._y = this.items[i]._y + this.camera.speedY;
        }

        localStorage.setItem('cameraX', this.camera.x);
        localStorage.setItem('cameraY', this.camera.y);
    }

    setTimer(){

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