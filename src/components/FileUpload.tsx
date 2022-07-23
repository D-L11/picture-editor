import React, {useState, useContext} from 'react'
import { Upload, message, Input, Modal } from 'antd';
import { LoadingOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { post } from '../network/Request'
import { Preview } from '../utils/preview'
import { PopupContext } from '../views/HomePage'
import { IPictureModel } from '../type'


export default (prop: {popupSetter: any, addImage: any}) => {
    const popup = useContext(PopupContext)
    const { popupSetter } = prop
    const [imageUrl, setImageUrl] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const addImage = prop.addImage
    
    const preview = new Preview()

    const handleChange = (files: any) => {
      preview.preview(files.fileList).then(imageModel => {
        setImageUrl(imageModel.Image as string)
        setName(imageModel.Name)
      }).catch ((e: unknown) => {
        console.log(e)
      })
    }

    const handleDescriptionChange = (e: any) => {
      const value = e.nativeEvent.target.value
      if (value) {
        setDescription(value)
      }
    }

    const handleTagsChange = (e: any) => {
      const value = e.nativeEvent.target.value
      if (value) {
        setTags(value)
      }
    }

    const uploadImage = async () => {
      try {
          const result = await post('http://localhost:4000/add', {
          Description: description,
          Name: name,
          Tags: tags,
          Image: imageUrl
        })
      } catch (e: unknown) {
        message.error('up loading unsuccessfull')
      }
    }

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const handleCancel = () => {
      popupSetter(false)
      setName('')
      setDescription('')
      setTags('')
      setLoading(false)
      setImageUrl('')
    };

    const handleOk = async () => {
      try {
        await uploadImage()
        const ImageInfo: IPictureModel = {
          Image: imageUrl,
          Name: name,
          Description: description,
          Tags: tags
        }
        addImage({type: 'addImage', payload: ImageInfo})
        message.success('uploading successfull!')
        handleCancel()
      } catch (e: unknown) {
        message.error('up loading unsuccessfull')
      }
    };


    const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      );
    return (
        <Modal
          title="Basic Modal" 
          visible={popup} 
          onOk={handleOk} 
          onCancel={handleCancel}
          width={500} 
        >
          <div className="file-upload-container">
            <Upload
             name="avatar"
             listType="picture-card"
             className="avatar-uploader"
             showUploadList={false}
             beforeUpload={beforeUpload}
             onChange={handleChange}
           >
               {imageUrl ? <img src={imageUrl} style={{ width: '100%' }} /> : uploadButton}
           </Upload>
           <Input size="large" placeholder="Tags" prefix={<UnorderedListOutlined />} style={{marginBottom: 10}} onChange={(event: any) => {handleTagsChange(event)}}></Input>
           <Input size="large" placeholder="Description" prefix={<UnorderedListOutlined />} onChange={(event: any) => {handleDescriptionChange(event)}}></Input>
         </div>
        </Modal>
    )
}