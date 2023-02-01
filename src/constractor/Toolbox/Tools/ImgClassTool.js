export default class ImgClassTool{

    constructor(scene, element) {
        this.scene = scene;
        this.elementClass = element;
    }

    init(){

        let elements = document.querySelectorAll(this.elementClass);

        elements.forEach((element) => {
            element.addEventListener('click', (e) => {
                this.scene.selected.class = e.target.dataset.type;
                document.querySelectorAll(this.elementClass).forEach((item) => {
                    item.classList.remove('active');
                })
                e.target.classList.add('active');
            })
        })
    }

    save() {

        console.log(this.scene.items);

    }

    }