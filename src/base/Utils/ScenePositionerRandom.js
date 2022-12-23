import GameHelper from '../Utils/GameHelper';

export default class ScenePositionerRandom{
		
    constructor(
        startX, 
        startY,
        endX,
        endY
    ) {
        
        this.counter = 0;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.helper = new GameHelper();

      }

    getCoords(num){

        
        let x = this.helper.getRandomInt(this.startX, this.endX);
        let y = this.helper.getRandomInt(this.startY, this.endY);

        return {
          "x"  : x,
          "y"  : y
        };

    }

}