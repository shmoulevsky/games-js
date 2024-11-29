

export default class UIRenderer{

    render(
        ctx,
        right,
        wrong,
        points,
        screenWidth,
        screenHeight,
        minutes,
        seconds,
        stripeWidth
        ){

        ctx.fillStyle = "#ffffff";
        ctx.font = "20pt Arial";
        ctx.fillText(right , screenWidth - 200, 70);
        ctx.fillText(wrong , screenWidth - 100, 70);
        ctx.fillText(points , screenWidth - 400, 70);

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, stripeWidth, 10);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(minutes + ':' + seconds , 50, 70);

    }

}