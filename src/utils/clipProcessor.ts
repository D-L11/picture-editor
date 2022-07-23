import {canvasProcessor, CanvasProcessor} from './canvasProcesser'

export class ClipProcessor {
    private canvasProcessor: CanvasProcessor

    constructor () {
        this.canvasProcessor = canvasProcessor
    }

    public drawRectangle (board: CanvasRenderingContext2D, initPos: [number, number], endPos: [number, number]) {
        this.canvasProcessor.drawRectangle(board, initPos, endPos)
    }

    public drawShadow (board: CanvasRenderingContext2D, initPos: [number, number], endPos: [number, number]) {
        board.fillStyle = 'rgba(74, 73, 73, .5)'
        board.clearRect(...initPos, ...endPos)
        board.fillRect(...initPos, ...endPos)
    }

    public clipImage (canvas: HTMLCanvasElement, board: CanvasRenderingContext2D, image: string, initPos: [number, number], endPos: [number, number], callback: () => void) {
        const img = new Image()
        img.src = image
        let [startX, startY] = initPos
        let [endX, endY] = endPos
        const direction = this.getClipingDirection(initPos, endPos)
        if (direction === 'fromRightTop') {
            [startX, startY] = [endX, startY];
            [endX, endY] = [startX, endY]
        } else if (direction === 'fromRightBottom') {
            [startX, startY] = [endX, endY];
            [endX, endY] = [startX, startY]
        } else if (direction === 'fromLeftBottom') {
            [startX, startY] = [startX, endY];
            [endX, endY] = [endX, startY]
        }
        canvas.width = endX - startX
        canvas.height = endY - startY
        img.onload = function () {
            board.drawImage(img, startX, startY, endX - startX, endY - startY, 0, 0, endX - startX, endY - startY)
            callback()
        }
    }

    public clearRectangle (board: CanvasRenderingContext2D, initPos: [number, number], endPos: [number, number]) {
        const [startX, startY] = initPos
        const [endX, endY] = endPos
        const isFromLeftTop = startX < endX && startY < endY
        const isFromRightTop = startX > endX && startY < endY
        const isFromRightBottom = startX > endX && startY > endY
        const isFromLeftBottom = startX < endX && startY > endY
        if (isFromLeftTop) {
            this.canvasProcessor.clearRectangle(board, initPos, endPos)
        } else if (isFromRightBottom) {
            this.canvasProcessor.clearRectangle(board, endPos, initPos)
        } else if (isFromLeftBottom) {
            this.canvasProcessor.clearRectangle(board, [startX, endY], [endX, startY])
        } else if (isFromRightTop){
            this.canvasProcessor.clearRectangle(board, [endX, startY], [startX, endY])
        }
    }

    private getClipingDirection (initPos: [number, number], endPos: [number, number]): string {
        const [startX, startY] = initPos
        const [endX, endY] = endPos
        if (startX < endX && startY < endY) {
            return 'fromLeftTop'
        } else if (startX > endX && startY < endY) {
            return 'fromRightTop'
        } else if (startX > endX && startY > endY) {
            return 'fromRightBottom'
        } else {
            return 'fromLeftBottom'
        }
    } 
}

const clipProcessor = new ClipProcessor()

export { clipProcessor }