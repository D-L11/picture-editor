import {canvasProcessor, CanvasProcessor} from './canvasProcesser'


export class PaintingProcessor {
    public points: Array<[number, number]> = []
    private startPoint: [number, number] = [0, 0]
    private canvasProcessor: CanvasProcessor
    constructor() {
        this.canvasProcessor = canvasProcessor
    }

    public startPainting (startPoint: [number, number]) {
        this.points.push(startPoint)
        this.startPoint = startPoint
    }

    public paint (board: CanvasRenderingContext2D, point: [number, number], color: string = 'black', lineWidth: number = 1, isLineDotted: boolean = false) {
        this.points.push(point)
        this.canvasProcessor.paintLine(board, this.startPoint, point, color, lineWidth, isLineDotted)
        this.startPoint = point
    }
}

const paintingProcessor = new PaintingProcessor()
export { paintingProcessor }