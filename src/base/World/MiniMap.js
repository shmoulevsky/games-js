export default class MiniMap{

    constructor(bg, width, height, cameraWidth, cameraHeight, scale, border) {

        this.coefX = width / cameraWidth;
        this.coefY = height / cameraHeight;
        this.scale = scale;
        this.border = border;

        this.big = {
            x : 650,
            y : 500,
            width : width / scale,
            height : height / scale,
        }

        this._x = this.big.x;
        this._y = this.big.y;
        this._iwidth = this.big.width;
        this._iheight = this.big.height;
        this.isShow = true;

        this.small = {
            x : 650,
            y : 500,
            width : this.big.width / this.coefX,
            height : this.big.height / this.coefY,
        }

        this.img = new Image();
        this.img.src = bg;
        this.img.addEventListener(
            "load",
            () => {

            },
            false
        );




    }

    getWorldCoords(mouseX, mouseY){
        let x = ((mouseX) - this.big.x) * this.scale;
        let y = ((mouseY) - this.big.y) * this.scale;
        return {x, y}
    }

    draw(ctx, worldX, worldY){

        this.small.x = (Math.abs((worldX - this.border) / this.scale)) + this.big.x;
        this.small.y = (Math.abs((worldY - this.border) / this.scale)) + this.big.y;

        if(this.img){
            ctx.drawImage(this.img, this.big.x, this.big.y, this.big.width, this.big.height);
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        ctx.strokeRect(this.small.x, this.small.y, this.small.width, this.small.height);
    }

}