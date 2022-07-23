import { post } from '../network/Request'
import { message } from 'antd'

export class SaveImage {
    constructor () {}

    public async save (canvas: HTMLCanvasElement, Name: string, Description: string, Tags: string) {
        const Image = canvas.toDataURL()
        try {
            await post('http://localhost:4000/add', {
                Image,
                Name,
                Description,
                Tags
            })
            message.success('图片保存成功！')
        } catch (e: unknown) {
            message.error('图片保存失败')
        }
    }
}

const saveImage = new SaveImage()
export { saveImage }