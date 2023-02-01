import Cords from "./Cords";

export default class Selection{

    constructor(){
        this.clear();
        this.clearItems();
        this.isMouse = false;
        this.isItem = false;
    }

    clear(){
        this.width = 0;
        this.height = 0;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this._x = 0;
        this._y = 0;
        this._iwidth = 0;
        this._iheight = 0;
    }

    addItem(item) {
        this.items.push(item);
    }

    setClicked(e, canvas) {
        this.isMouse = true;

        let cords = Cords.calc(e, canvas);

        this.startX = cords.x;
        this.startY = cords.y;
        this._x = cords.x;
        this._y = cords.y;
    }

    isActive() {
        return this.isMouse && !this.isItem
    }

    move(e, canvas) {

        let cords = Cords.calc(e, canvas);

        this.width = parseInt(cords.x) - parseInt(this.startX);
        this.height = parseInt(cords.y) - parseInt(this.startY);
        this._iwidth = this.width;
        this._iheight = this.height;
        this.currentX = coords.x;
        this.currentY = coords.y;
    }

    clearItems() {
        this.items = [];
    }
}