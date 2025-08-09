export default class DefaultSettings{
    constructor() {

        this.path = {};
        this.time = {};

        this.path.img = '/storage/assets/';
        this.path.snd = '/storage/assets/snd';
        this.scaleImg = 0.5;
        this.time.all = 2;
        this.time.short = 15;
        this.width = 1024;
        this.height = 700;

        let outerParams = document.getElementById('game-params')?.value ?? '';

        if(outerParams){
            outerParams = JSON.parse(outerParams);
        }

        this.title = outerParams?.title ?? '';
        this.lang = localStorage.getItem('lang') ?? outerParams?.lang ?? 'en';
        this.user = outerParams?.user ?? '';
        this.options = outerParams?.options ?? [];
    }
}