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

        this.backgrounds = [
            '/bg/bg-01.svg',
            '/bg/bg-01.svg',
            '/bg/bg-01.svg',
        ];

        this.heros = [
            {path : '/hero/owl.svg', x: 650, y: 320, width: 300, height: 344},
            {path : '/hero/owl.svg', x: 650, y: 320, width: 300, height: 344},
            {path : '/hero/owl.svg', x: 650, y: 320, width: 300, height: 344},
        ];

    }

    getBackground(){
        let i = this.helper.getRandomInt(0,2)
        return  this.backgrounds[i]
    }

    getHero(){
        let i = this.helper.getRandomInt(0,2)
        return  this.heros[i];
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