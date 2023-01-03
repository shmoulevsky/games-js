export default class ScenePositionerHorizontal{
		
    constructor(
        startX, 
        startY,
        offsetX,
        offsetY,
        countInRow
    ) {
        this.init(
            startX,
            startY,
            offsetX,
            offsetY,
            countInRow
        );
      }

    init(
        startX,
        startY,
        offsetX,
        offsetY,
        countInRow
    ) {

        this.counter = 0;
        this.startX = startX;
        this.startY = startY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
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