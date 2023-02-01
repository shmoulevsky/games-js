export default class Toolbox{

    constructor() {
        this.items = [];
    }

    add(item) {
        this.items.push(item);
    }

    init(){
        this.items.forEach((item) =>{
            item.init();
        })
    }

}