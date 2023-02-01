export default class PositionTool{

    constructor(scene, element) {
        this.scene = scene;
        this.elementClass = element;
    }

    init(){

        let elements = document.querySelectorAll(this.elementClass);

        elements.forEach((element) => {
            element.addEventListener('click', (e) => {
                let type = e.target.dataset.type;
                switch (type) {
                    case 'left' : this.alignLeft();break;
                    case 'right' : this.alignRight();break;
                    case 'top' : this.alignTop();break;
                    case 'bottom' : this.alignBottom();break;
                    case 'horizontally' : this.alignHorizontally();break;
                    case 'vertically' : this.alignVertically();break;
                }

            })
        })
    }

    alignLeft() {

        let data = this.scene.selection.items.map(item => item['_x']);
        let x = Math.min(...data);

        for(let i = 0;i < this.scene.selection.items.length; i++){
            this.scene.selection.items[i]._x = x;
        }
    }

    alignRight() {

        let data = this.scene.selection.items.map(item => item['_x']);
        let x = Math.max(...data);

        for(let i = 0;i < this.scene.selection.items.length; i++){
            this.scene.selection.items[i]._x = x;
        }
    }

    alignTop() {
        let data = this.scene.selection.items.map(item => item['_y']);
        let y = Math.min(...data);

        for(let i = 0;i < this.scene.selection.items.length; i++){
            this.scene.selection.items[i]._y = y;
        }
    }

    alignBottom() {
        let data = this.scene.selection.items.map(item => item['_y']);
        let y = Math.max(...data);

        for(let i = 0;i < this.scene.selection.items.length; i++){
            this.scene.selection.items[i]._y = y;
        }
    }

    alignHorizontally() {

        let data = this.scene.selection.items.map(item => item['_x']);
        let xMin = Math.min(...data);
        let xMax = Math.max(...data);
        let dist = ((xMax - xMin) / (data.length - 1));

        let sortedItems = this.scene.selection.items.sort((a, b) => {
            if (a._x < b._x) {
                return -1;
            }
            if (a._x > b._x) {
                return 1;
            }
            return 0;
        });

        for(let i = 1;i < this.scene.selection.items.length - 1; i++){
            sortedItems[i]._x = xMin + (i * dist);
        }
    }

    alignVertically() {

        let data = this.scene.selection.items.map(item => item['_y']);
        let yMin = Math.min(...data);
        let yMax = Math.max(...data);
        let dist = ((yMax - yMin) / (data.length - 1));

        let sortedItems = this.scene.selection.items.sort((a, b) => {
            if (a._x < b._x) {
                return -1;
            }
            if (a._x > b._x) {
                return 1;
            }
            return 0;
        });

        for(let i = 0;i < this.scene.selection.items.length; i++){
            sortedItems[i]._y = yMin + (i * dist);
        }
    }

}