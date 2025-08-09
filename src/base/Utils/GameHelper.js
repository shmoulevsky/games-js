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

        // Поддержка текстовых элементов ColorfulText
        if (el.type === 'text') {
            return el.isCursorOver(e);
        }

        // Обычные элементы (Card, BaseSprite и т.д.)
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

        // Поддержка текстовых элементов ColorfulText
        if (el.type === 'text') {
            return el.isClick(e);
        }

        // Обычные элементы
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

 getArrayABC(l, c1, c2) {
        const alphabets = {
            // English (Latin)
            en: '$ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!#?/:;@_'.split(''),

            // Russian (Cyrillic)
            ru: '$АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789-!#?/:;@_'.split(''),

            // German
            de: '$ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜßabcdefghijklmnopqrstuvwxyzäöü0123456789-!#?/:;@_'.split(''),

            // French
            fr: '$ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸàâæçéèêëîïôœùûüÿ0123456789-!#?/:;@_'.split(''),

            // Italian
            it: '$ABCDEFGHIJKLMNOPQRSTUVWXYZÀÉÈÌÎÒÓÙÚÛàéèìîòóùúû0123456789-!#?/:;@_'.split(''),

            // Turkish
            tr: '$ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz0123456789-!#?/:;@_'.split(''),

            // Korean (Hangul)
            ko: '$ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ0123456789-!#?/:;@_'.split(''),

            // Japanese (Hiragana + Katakana)
            jp: '$あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789-!#?/:;@_'.split(''),

            // Hebrew
            he: '$אבגדהוזחטיכךלמםנןסעפףצץקרשת0123456789-!#?/:;@_'.split(''),

            // Spanish
            es: '$ABCDEFGHIJKLMNOPQRSTUVWXYZÑÁÉÍÓÚÜñáéíóúü0123456789-!#?/:;@_'.split(''),

            // Portuguese
            pt: '$ABCDEFGHIJKLMNOPQRSTUVWXYZÁÂÃÀÇÉÊÍÓÔÕÚáâãàçéêíóôõú0123456789-!#?/:;@_'.split(''),

            // Ukrainian
            ua: '$АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя0123456789-!#?/:;@_'.split(''),

            // Hindi (Devanagari)
            hi: '$अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह0123456789-!#?/:;@_'.split(''),

            // Chinese (Simplified - Common characters)
            cn: '$的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞0123456789-!#?/:;@_'.split(''),

            // Arabic
            ar: '$ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْ٠١٢٣٤٥٦٧٨٩-!#?/:;@_'.split('')
        };

        // Если передан только язык – вернуть весь алфавит
        if (!c1 && !c2) return alphabets[l];

        // Иначе – вернуть срез между c1 и c2
        return alphabets[l].slice(
            alphabets[l].indexOf(c1),
            alphabets[l].indexOf(c2) + 1
        );
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