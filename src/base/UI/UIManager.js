import BaseSprite from '../Images/BaseSprite';
import gsap from "gsap";

export default class UIManager{
		
    
    constructor(imgPath, sndPath){

        this.points = 0;
        this.right = 0;
        this.wrong = 0;
        this.tweens = [];
        this.sounds = [];

        this.ui = {};
        

        this.ui.ok = new BaseSprite(imgPath + '/ui/tablo-ok.svg','smaile-ok','smile',560,25,25,25,' ');
        this.ui.wrong = new BaseSprite(imgPath + '/ui/tablo-wrong.svg','smaile-wrong','smile',660,25,25,25,' ');
        this.ui.coin = new BaseSprite(imgPath + '/ui/coin.svg','smaile-wrong','smile',350,20,45,45,' ');

        this.ui.ok.scale = 1;
        this.ui.wrong.scale = 1;

        this.tweens['ok'] = gsap.to(this.ui.ok, { scale : this.ui.ok._width * 8, duration : 1, repeat: -1, yoyo:true});
		this.tweens['wrong'] = gsap.to(this.ui.wrong, { scale : 2, duration : 1, repeat: -1, yoyo:true});				
		
        this.sounds['ok'] = new Audio(sndPath + 'molodec.mp3');
        this.sounds['wrong'] = new Audio(sndPath + 'esho.mp3');


    }

 
}