export default class Cords {
    static calc(e, canvas)
    {
        return {
            x: parseInt(e.clientX) - parseInt(canvas.offsetLeft),
            y: parseInt(e.clientY) - parseInt(canvas.offsetTop),
        }

    }
}