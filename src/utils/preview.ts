import { IPictureModel, PictureModel} from '../type'

export class Preview {
  private i = 0
  constructor () {}
    public preview (files: any): Promise<IPictureModel> {
      return new Promise((resolve, reject) => {
        if (files.length === 0) {
          return
        }
        const file = files[0].originFileObj
        files = []
        if (file.type.match(/image\/*/) === null) {
          reject(`The file is not an image file`)
          return
        }
        const imageModel: IPictureModel = new PictureModel()
        imageModel.Name = file.name
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          imageModel.Image = reader.result
          resolve(imageModel)
        }
      })
    }
  }