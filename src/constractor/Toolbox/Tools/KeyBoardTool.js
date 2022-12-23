import Card from "../../../base/Images/Card";

export default class KeyBoardTool{

    constructor(scene) {
        this.scene = scene;
    }

    init(){

        window.addEventListener('keydown', (e) => {

            switch (e.key) {
                case  "Delete" : this.delete(); break;
            }

            if(e.ctrlKey && e.key === "d"){
                this.duplicate();
                e.preventDefault()
                e.stopPropagation()
            }



        })

    }


    delete() {

        for(let i = 0; i < this.scene.selection.items.length; i++){
            for(let j = 0; j < this.scene.items.length; j++){
                if(this.scene.selection.items[i] === this.scene.items[j]){
                    this.scene.items.splice(j,1);
                }
            }

        }
    }

    duplicate() {

        for(let i = 0; i < this.scene.selection.items.length; i++){
            for(let j = 0; j < this.scene.items.length; j++){
                if(this.scene.selection.items[i] === this.scene.items[j]){

                    let item = new Card(
                        this.scene.items[j].currentSrc,
                        'item','item',
                        this.scene.items[j]._x,
                        this.scene.items[j]._y,
                        this.scene.items[j]._iwidth,
                        this.scene.items[j]._iheight, 0, true, true);

                    //item._x = parseInt(item._iwidth) + parseInt(item._x) + 20;
                    this.scene.items.push(item);

                    this.scene.selection.isItem = false;
                    this.scene.selection.isMouse = false;

                    break;
                }
            }

        }
    }
}