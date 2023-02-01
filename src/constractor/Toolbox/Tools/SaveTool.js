export default class SaveTool{

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
                    case 'save-scene' : this.save();break;
                }

            })
        })
    }

    save() {

        console.log(this.scene.items);

    }

    }