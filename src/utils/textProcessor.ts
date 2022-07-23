import { canvasProcessor, CanvasProcessor } from './canvasProcesser'


export class TextProcessor {
  initPos: [number, number] = [0, 0]
  canvasProcessor: CanvasProcessor
  constructor() { 
      this.canvasProcessor = canvasProcessor
  }

  public addText (board: CanvasRenderingContext2D, text: string, initPos: [number, number], color: string = 'black', size: number = 10, font: string = '宋体') {
      this.canvasProcessor.addText(board, text, initPos, color, size, font)
  }

//   public clearText () {
//     this.text = ''
//     this.initPos = [0, 0]
//   }
}

const textProcessor = new TextProcessor()

export { textProcessor }
