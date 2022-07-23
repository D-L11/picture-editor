import React, { useEffect, useState } from 'react'
import { IPictureModel } from '../type'
import { Card, message } from 'antd';
import { ClearOutlined, VerticalAlignBottomOutlined, FormOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { post } from '../network/Request'


const { Meta } = Card;

const DisplayCard = (props: {imageInfo: IPictureModel}) => {
    const {Name, Image, Description, Tags} = props.imageInfo
    const navigate = useNavigate()
    const [editClicked, setEditClicked] = useState(false)

    const handleEditClick = () => {
      setEditClicked(true)
    }
    
    useEffect(() => {
      if (editClicked) {
        localStorage.setItem('imageUrl', Image as string)
        navigate('/edit')
      }
    }, [editClicked])

    const downloadImage = () => {
      const a = document.createElement('a')
      a.download = Name
      a.href = Image as string
      const clickEvent = new MouseEvent('click')
      a.dispatchEvent(clickEvent)
    }

    const deletePicture = async () => {
      try {
        const result = await post('http://localhost:4000/delete', {
            Image: Image
        })
        message.success('删除成功！')
      } catch (e) {
          message.error('删除失败')
      }
    }

    return (
        <Card
            cover={
               <img
                 alt="example"
                 src={Image as string}
                 className="cover-image"
                 style={{
                  objectFit: 'contain',
                  overflow: "hidden"
                 }}
               />
            }
            actions={[
              <FormOutlined key="edit" alt="edit" title="edit" onClick={handleEditClick}/>,
              <VerticalAlignBottomOutlined key="download" alt="download" title="download" onClick={downloadImage}/>,
              <ClearOutlined key="delete" alt="delete" title="delete" onClick={deletePicture}/>,
            ]}
            hoverable={true}    
        >
            <Meta
              title={Name}
              description={Description}
            />
        </Card>
    )
}

export { DisplayCard }