import TextCard from './../../base/Images/TextCard'

export default class CardManager{
		
    createCard(cardBg, canvasId, tag, i, value, x, y, width, height, isDraggable, canDrag, fontStyle)
    {
    
        let name = tag + '-' + i;
        let card = new TextCard('', name , tag, x , y , width, height, value, isDraggable, canDrag, canvasId, cardBg, 3, fontStyle);
        
        return card;
    }

 
}