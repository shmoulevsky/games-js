import GameHelper from "../Utils/GameHelper";

export default class AssetManager{

    constructor(){

        this.helper = new GameHelper()

        this.startBackgrounds = [
            '/start/start-bg.svg',
            '/start/start-bg.svg',
            '/start/start-bg.svg',
        ]

        this.settingsBackgrounds = [
            '/start/start-bg.svg',
            '/start/start-bg.svg',
            '/start/start-bg.svg',
        ]

        this.winBackgrounds = [
            '/win/win-bg.svg',
            '/win/win-bg.svg',
            '/win/win-bg.svg',
        ]

        this.backgrounds = {
            'bg' : ['01.svg', '02.svg', '03.svg', '04.svg', '05.svg', '06.svg', '07.svg'],
            'sea' : ['01.svg', '02.svg'],
            'forest' : ['01.svg', '02.png'],
            'desert' : ['01.svg', '01.svg'],
            'cosmos' : ['01.svg', '01.svg'],
            'ice' : ['01.svg', '01.svg'],
            'island' : ['01.svg', '01.svg'],
            'tropic' : ['01.svg', '01.svg'],
        }

        this.heros = {
            'bg' : [
                {path : 'rubber2.svg', width: 231, height: 426, offsetX: 0, offsetY: 0},
                {path : 'ruller.svg', width: 132, height: 495, offsetX: 0, offsetY: 0},
                {path : 'compass.svg', width: 167, height: 430, offsetX: 0, offsetY: 0},
                {path : 'pencil.svg', width: 108, height: 348, offsetX: 0, offsetY: 0},
                {path : 'circle.svg', width: 243, height: 244, offsetX: 0, offsetY: 0},
                {path : 'square.svg', width: 243, height: 244, offsetX: 0, offsetY: 0},
                {path : 'triangle.svg', width: 243, height: 244, offsetX: 0, offsetY: 0},
            ],
            'sea' : [
                {path : 'turtle.svg', width: 370, height: 367, offsetX: 0, offsetY: 0},
                {path : 'turtle2.svg', width: 375, height: 370, offsetX: 0, offsetY: 0}
            ],
            'forest' : [
                {path : 'fox.svg', width: 400, height: 382, offsetX: 0, offsetY: 0},
                {path : 'fox2.svg', width: 400, height: 400, offsetX: 0, offsetY: 0},
                {path : 'owl.svg', width: 300, height: 344, offsetX: 0, offsetY: 0},
            ],
            'desert' : [],
            'cosmos' : [],
            'ice' : [
                {path : 'snowman.svg', width: 340, height: 615, offsetX: 0, offsetY: 0},
            ],
            'island' : [],
            'tropic' : [],
        };


        /*this.heros = [
            {path : '/hero/alpaca.svg', x: 700, y: 270, width: 311, height: 420},
            {path : '/hero/swan.svg', x: 720, y: 270, width: 263, height: 400},
            {path : '/hero/fox2.svg', x: 620, y: 270, width: 400, height: 400},
            {path : '/hero/fox.svg', x: 620, y: 270, width: 400, height: 382},
            {path : '/hero/turtle2.svg', x: 620, y: 270, width: 370, height: 367},
            {path : '/hero/turtle.svg', x: 640, y: 270, width: 370, height: 367},
            {path : '/hero/snowman.svg', x: 650, y: 50, width: 340, height: 615},
            {path : '/hero/vulture.svg', x: 650, y: 270, width: 300, height: 400},
            {path : '/hero/owl.svg', x: 650, y: 320, width: 300, height: 344},
        ];*/

    }

    getEnviroment(code = ''){

        let maxBg = this.backgrounds[code].length
        let bgIndex = this.helper.getRandomInt(0, maxBg - 1)

        let maxHero = this.heros[code].length
        let heroIndex = this.helper.getRandomInt(0,maxHero - 1)

        let bgPath = '/bg/'+code+'/'+code+'-'+this.backgrounds[code][bgIndex];

        let path = '/hero/' + this.heros[code][heroIndex].path
        let width = this.heros[code][heroIndex].width
        let height = this.heros[code][heroIndex].height
        let x = 1024 - width - 50
        let y = 700 - height - 50

        return  {
            'bg' : bgPath,
            'hero' : {'path' : path, x, y, width,  height},
        }

    }



    getHero(){

    }

    getStartBackground(){
        let i = this.helper.getRandomInt(0,2)
        return  this.startBackgrounds[i];
    }

    getSettingsBackground(){
        let i = this.helper.getRandomInt(0,2)
        return  this.settingsBackgrounds[i];
    }

    getWinBackground(){
        let i = this.helper.getRandomInt(0,2)
        return  this.winBackgrounds[i];
    }

 
}