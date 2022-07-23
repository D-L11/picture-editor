import { canvasProcessor, CanvasProcessor} from './canvasProcesser'

export class RotateProcessor {
    private canvasProcessor: CanvasProcessor
    private currentAngle: number = 0
    constructor () {
        this.canvasProcessor = canvasProcessor
    }

    public rotateRight (board: CanvasRenderingContext2D, canvas: HTMLCanvasElement, image: string) {
        const img = new Image()
        img.src = image
        const temp = canvas.width
        canvas.width = canvas.height
        canvas.height = temp
        board.save()
        this.currentAngle = (this.currentAngle + 90) % 360
        if (this.currentAngle === 90) {
            this.canvasProcessor.translate(board, canvas.width, 0)
        } else if (this.currentAngle === 180) {
            this.canvasProcessor.translate(board, canvas.width, canvas.height)
        } else if (this.currentAngle === 270) {
            this.canvasProcessor.translate(board, 0, canvas.height)
        } else {
            this.canvasProcessor.translate(board, 0, 0)
        }
        this.canvasProcessor.rotate(board, this.currentAngle)
        img.onload = () => {
            board.drawImage(img, 0, 0)
            board.restore()
        }
    }
}

const rotateProcessor = new RotateProcessor()

export { rotateProcessor }