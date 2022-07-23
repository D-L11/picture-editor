

class CanvasProcessor {
    constructor () {}

    public drawRectangle (board: CanvasRenderingContext2D, start: [number, number], end: [number, number]): void {
        // const clearArea: [number, number] = [Math.sqrt(start[0] ** 2 - end[0] ** 2), Math.sqrt(start[1] ** 2 - end[1] ** 2)]
        const [startX, startY] = start
        const [endX, endY] = end  
        board.clearRect(...start, endX - startX, endY - startY)
        // board.strokeStyle = 'rgba(74, 73, 73, .5)'
        // board.strokeRect(startX, startY, endX - startX, endY - startY)
    }

    public clearRectangle (board: CanvasRenderingContext2D, start: [number, number], end: [number, number]) {
        board.clearRect(...start, ...end)
    }
    
    public clearup (board: CanvasRenderingContext2D, canvas: HTMLCanvasElement, start: [number, number], end: [number, number]): void {
        const [startX, startY] = start
        const [endX, endY] = end
        board.clearRect(0, 0, startX, startY)
        board.clearRect(0, startY, startX, endY)
        board.clearRect(0, endY, startX, canvas.height - endY)
        board.clearRect(endX, 0, canvas.width - endX, startY)
        board.clearRect(endX, startY, canvas.width - endX, endY)
        board.clearRect(endX, endY, canvas.width - endX, canvas.height - endY)
        board.clearRect(startX, 0, endX, startY)
        board.clearRect(startX, endY, endX, canvas.height - endY)
    }
    
    public rotate (board: CanvasRenderingContext2D, angle: number): void {
        board.rotate(angle * Math.PI / 180)
    }
    
    public translate (board: CanvasRenderingContext2D, x: number, y: number): void {
        board.translate(x, y)
    }
    
    public addText (board: CanvasRenderingContext2D, text: string, initPos: [number, number], color: string, size: number, font: string) {
        board.fillStyle = color
        board.font = `${size}px ${font}`
        board.fillText(text, initPos[0], initPos[1])
    }
    
    public paintLine (board: CanvasRenderingContext2D, start: [number, number], end: [number, number], color: string, lineWidth: number, isLineDotted: boolean) {
        board.beginPath()
        board.strokeStyle = color
        board.lineWidth = lineWidth
        if (isLineDotted) {
            board.setLineDash([1, 5])
        }
        board.moveTo(...start)
        board.lineTo(...end)
        board.closePath()
        board.stroke()
    }
}

const canvasProcessor = new CanvasProcessor

export { CanvasProcessor , canvasProcessor }