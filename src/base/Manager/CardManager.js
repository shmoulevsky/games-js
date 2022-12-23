import Card from './../../base/Images/Card'

export default class CardManager{
		
    
    createCard(path ,tag, i, width, height, isDraggable, numFrames, scale, pos)
    {
    
        let name = tag + '-' + i;
        
        let card = new Card(path, name, tag, 0, 0, width, height,' ' , false, isDraggable, numFrames);

        card.setScale(scale);
        card.pos = pos;
        
        return card;
    }

 
}