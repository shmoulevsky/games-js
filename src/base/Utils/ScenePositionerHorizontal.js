export default class ScenePositionerHorizontal{
		
    constructor(
        startX, 
        startY,
        offsetX,
        offsetY,
        countInRow,
        scale
    ) {
        this.init(
            startX,
            startY,
            offsetX,
            offsetY,
            countInRow,
            scale
        );
      }

    init(
        startX,
        startY,
        offsetX,
        offsetY,
        countInRow,
        scale
    ) {

        this.counter = 0;
        this.startX = startX * scale;
        this.startY = startY * scale;
        this.offsetX = offsetX * scale;
        this.offsetY = offsetY * scale;
        this.offset = 0;
        this.countInRow = countInRow;

    }

    getCoords(num){

        if(num % this.countInRow == 0 && num != 0) {
            this.offset += this.offsetY;
            this.counter = 0;
        }

        let x = (this.offsetX * this.counter) + this.startX;
        let y = this.startY + this.offset;
        this.counter++;

        return {
          "x"  : x,
          "y"  : y
        };

    }

}