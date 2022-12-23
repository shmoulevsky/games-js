export default class ScenePositionerVertical{
		
    constructor(
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
            this.offset += this.offsetX;
            this.counter = 0;
        }

        let x = this.startX + this.offset;
        let y = (this.offsetY * this.counter) + this.startY;
        this.counter++;

        return {
          "x"  : x,
          "y"  : y
        };

    }

}