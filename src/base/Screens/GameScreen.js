export default class GameScreen{
    constructor(){
        this.items = [];
        this.tweens = [];
        this.sounds = [];
        this.isShow = false;
    }
    render(){}
    restart(){}
    checkMouseUp(e){}
    checkMouseClick(e){}

    scale(scale){
        if(this.items){
            for(let i=0;i<this.items.length;i++) {
                this.scale = scale;
                this.items[i].setScale(scale);
            }
        }
    }

}