export default class GameHelper{
		
    isIntersect(r1,r2, t = 0){
      
      if((r1._x > r2._x - t && r1._x < r2._x + r2._iwidth + t && r1._y > r2._y - t && r1._y < r2._y + r2._iheight + t) || 
          (r1._x + r1._iwidth > r2._x - t && r1._x + r1._iwidth < r2._x + r2._iwidth + t && r1._y > r2._y - t && r1._y < r2._y + r2._iheight + t) 
          || (r1._x > r2._x - t && r1._x < r2._x + r2._iwidth + t && r1._y + r1._iheight > r2._y - t && r1._y + r1._iheight < r2._y + r2._iheight + t) 
          || (r1._x + r1._iwidth > r2._x - t && r1._x + r1._iwidth < r2._x + r2._iwidth + t && r1._y + r1._iheight > r2._y && r1._y -t + r1._iheight < r2._y + r2._iheight + t)){
            return true;
        }else{
            return false;
        }
      
      
  }
  
  isCursor(e, el){
       
       e._x = e.pageX - e.target.offsetLeft;
       e._y = e.pageY - e.target.offsetTop;

       const _x = parseInt(el._x) + parseInt(el._iwidth * el.scale);
       const _y = parseInt(el._y) + parseInt(el._iheight * el.scale);


       if(e._x > el._x
           && e._x < _x
           && e._y > el._y
           && e._y < _y
           && el.isShow
           && el.canDrag){

           return true
       }else{
         return false;
     }
                
  }
  
  isClick(e, el){
       
       e._x = e.pageX - e.target.offsetLeft;
       e._y = e.pageY - e.target.offsetTop;
       
       if(e._x > el._x && e._x < el._x + el._iwidth && e._y > el._y && e._y < el._y + el._iheight && el.isShow){ 
           return true
       }else{
         return false;
     }
                
  }
  
  getRandomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  getRandomArrayItem(array){
       return array[Math.floor(Math.random() * array.length)];
  }
  
  shuffle(a) {
      
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    
    return a;
 }
 
 genCharArray(charA, charZ) {
    
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (var i = 0; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}

getArrayABC(c1,c2,l) {
    var a = [];
    a['EN'] = '$ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!#?/:;@_'.split('');
    a['RU'] = '$АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789-!#?/:;@_'.split('');
    return (a[l].slice(a[l].indexOf(c1), a[l].indexOf(c2) + 1)); 
}

arrayMoveTo(arr, old_index, new_index) {

    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; 
}


 
}