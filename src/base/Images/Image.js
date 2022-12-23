export default class BaseImage extends Image{
	
    constructor(img, name, type, x , y , width, height, value) {
      super();
      this.name = name;
      this.type = type;
      this.value = value;
      this.src = img;
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this.isShow = true;
    }
         
}