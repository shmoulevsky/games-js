import GameScreen from './../../base/Screens/GameScreen'
import BaseSprite from './../../base/Images/BaseSprite'
import CardManager from './../../base/Manager/CardManager'
import TextCardManager from './../../base/Manager/TextCardManager'
import Card from "../../base/Images/Card";
import images from "../images";
import Selection from "../../base/Utils/Selection";
import Toolbox from "../Toolbox/Toolbox";
import PositionTool from "../Toolbox/Tools/PositionTool";
import KeyBoardTool from "../Toolbox/Tools/KeyBoardTool";
import Cords from "../../base/Utils/Cords";
import SaveTool from "../Toolbox/Tools/SaveTool";
import TextCard from "../../base/Images/TextCard";
import ImgClassTool from "../Toolbox/Tools/ImgClassTool";

// основной класс игры
export default class MainScreen extends GameScreen{
		
    constructor(bgImg, game, width = 800, height = 600){

        super();
        this.width = width;
        this.height = height;
        this.game = game;
        this.game.minutes = game.settings['minutes'];
        this.bg = bgImg;
        this.cardManager = new CardManager();    
        this.textCardManager = new TextCardManager();
        this.selection = new Selection();
        this.images = images;
        this.toolbox = new Toolbox();
        this.toolbox.add(new PositionTool(this, '.align-position'));
        this.toolbox.add(new SaveTool(this, '.save-scene'));
        this.toolbox.add(new KeyBoardTool(this));
        this.toolbox.add(new ImgClassTool(this, '.img-class'));
        this.toolbox.init();

        //this.selected.class = 'Card';

        this.initLabels();


    }

    initLabels(){

        this.inputs = {};
        this.inputs.cordX = document.getElementById('cord-x');
        this.inputs.cordY = document.getElementById('cord-y');
        this.inputs.scale = document.getElementById('scale');
        this.inputs.name = document.getElementById('name');
        this.inputs.type = document.getElementById('type');
        this.inputs.value = document.getElementById('value');
        this.inputs.width = document.getElementById('width');
        this.inputs.height = document.getElementById('height');
        this.inputs.distX = document.getElementById('dist-x');
        this.inputs.distY = document.getElementById('dist-y');

        let inputs = document.querySelectorAll('.item-input')

            inputs.forEach((input) => {
                input.addEventListener('input', (e) => {
                    if(!e.target.value) return;
                    let type = e.target.dataset.type;
                    for(let i = 0;i < this.selection.items.length; i++){
                        this.selection.items[i][type] = e.target.value;
                    }
            })
        })

        this.inputs.distX.addEventListener('input', (e) => {

            if(!e.target.value) return;

            let data = this.selection.items.map(item => item['_x']);
            let xMin = Math.min(...data);
            let dist = parseInt(e.target.value);

            let sortedItems = this.selection.items.sort((a, b) => {
                if (a._x < b._x) {
                    return -1;
                }
                if (a._x > b._x) {
                    return 1;
                }
                return 0;
            });

            for(let i = 1;i < this.selection.items.length; i++){
                sortedItems[i]._x = xMin + (i * dist);
            }

        })



    }

    initScene(){
        this.items = [];
        this.selected = {path : null};
        document.getElementById('game-canvas').addEventListener("contextmenu", e => e.preventDefault());

        for(let key in this.images){
            let img = document.createElement('div');
            img.classList.add('img-type');
            img.style.backgroundImage = `url(${images[key].path})`;
            img.dataset.path = images[key].path;
            img.dataset.width = images[key].width;
            img.dataset.height = images[key].height;
            document.getElementById('imgbox-wrap').appendChild(img);
            img.addEventListener('click',  (e) => {
                this.selected.path = e.target.dataset.path
                this.selected.width = e.target.dataset.width
                this.selected.height = e.target.dataset.height
                let images = document.querySelectorAll('.img-type');

                images.forEach(img => {
                    img.classList.remove('active');
                });

                e.target.classList.add('active');
            })
        }

    }

    checkMouseClick(e){

        this.selection.setClicked(e, this.game.canvas);
        let cords = Cords.calc(e, this.game.canvas);

        if(this.selected.path && e.which === 3){

            let item = null;

            switch (this.selected.class){

                case  'BaseSprite' :
                    item = new BaseSprite(
                        this.selected.path,
                        'item','item',
                        cords.x,
                        cords.y,
                        this.selected.width,
                        this.selected.height, 0, 1);
                    break;

                case  'Card' :
                item = new Card(
                    this.selected.path,
                    'item','item',
                    cords.x,
                    cords.y,
                    this.selected.width,
                    this.selected.height, 0, true, true);
                break;

                case  'TextCard' :
                    let fontStyle = {};
                    fontStyle.size = '30';
                    fontStyle.font = 'Arial';
                    fontStyle.color1 = 'black';
                    fontStyle.color2 = 'red';
                    fontStyle.x = 30;
                    fontStyle.xoffset = 10;
                    fontStyle.xoffset2 = 5;
                    fontStyle.y = 50;

                    let cardBg = new Image();
                    cardBg.src = this.selected.path;

                    let cardValue = document.getElementById('text-card-value').value ?? 0;

                    item = new TextCard(
                        this.selected.path,
                        'item',
                        'item',
                        cords.x,
                        cords.y,
                        this.selected.width,
                        this.selected.height,
                        cardValue,
                        true,
                        true,
                        'card-canvas',
                        cardBg,
                        1,
                        fontStyle
                    );
                    break;
            }

            this.selection.isItem = false;
            this.selection.isMouse = false;
            this.items.push(item);
        }

        let isEmptyPlace = true;

        for(let i = 0; i < this.items.length; i++){

            if(this.game.helper.isCursor(e, this.items[i])){
                isEmptyPlace = false;
                this.selection.isItem = true;
            }

            this.items[i].isSelected = this.game.helper.isCursor(e, this.items[i]) || this.selection.items.includes(this.items[i]);
            if(this.items[i].isSelected && !this.selection.items.includes(this.items[i])){
                this.selection.addItem(this.items[i]);
                this.inputs.cordX.value = this.items[i]._x;
                this.inputs.cordY.value = this.items[i]._y;
                this.inputs.scale.value = this.items[i].scale;
                this.inputs.name.value = this.items[i].name;
                this.inputs.type.value = this.items[i].type;
                this.inputs.value.value = this.items[i].value;
                this.inputs.width.value = this.items[i]._iwidth;
                this.inputs.height.value = this.items[i]._iheight;
            }
        }

        if(isEmptyPlace){
            this.selection.clearItems();
            this.selection.isItem = false;
        }

        console.log(this.selection.items);

    }

    checkMouseUp(e){

        this.selection.isMouse = false;

        for(let i = 0;i < this.items.length; i++){
            this.items[i].isSelected = this.game.helper.isIntersect(this.items[i], this.selection)
                || this.game.helper.isCursor(e, this.items[i]) || this.selection.items.includes(this.items[i]);

            if(this.items[i].isSelected && !this.selection.items.includes(this.items[i])){
                this.selection.addItem(this.items[i]);
            }

        }

        this.selection.clear();
    }

    checkMouseMove(e){
        if(this.selection.isActive()) {
            this.selection.move(e, this.game.canvas);
        }

        for(let i=0;i < this.items.length; i++){
            if(this.items[i].isDraggable){

            }
        }

    }

    render(){
        if(this.selection.isActive()){
            this.game.ctx.strokeRect(
                this.selection.startX,
                this.selection.startY,
                this.selection.width,
                this.selection.height
            )
        }

    }

}