import React, { useState, useReducer, useEffect } from 'react'
import { Layout, Menu } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
// import { FileUpload } from '../components/FileUpload'
import { IPictureModel } from '../type'
import { get } from '../network/Request'
import { DisplayCard } from '../components/DisplayCard'
import {List} from 'react-virtualized';


const FileUpload = React.lazy(() => import('../components/FileUpload'))

const { Content, Sider } = Layout;
interface State {
  images: IPictureModel[]
}

const createKey = (() => {
  let i = 1
  return (): number => {
    return i++
  }
})()

const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case 'set':
      return {images: [...state.images, action.payload]}
    case 'addImage':
      return {images: [action.payload, ...state.images]}
    default:
      return {images: []}
  }
}

const initialState: State = {
  images: []
}


const PopupContext = React.createContext(false)

export default () => {
    const [popup, setPopup] = useState(false)
    const [state, dispatch] = useReducer(reducer, initialState)
    
    useEffect(() => {
      initializePage()
    }, [])



    const initializePage = async () => {
      try {
        // const ids = await getImageIds()
        // if (!ids) throw new Error('获取id失败')
        await getImages()
      } catch (e: unknown) {
        console.log(e)
      }
    }

    const getImageIds = async () => {
      try {
        const result = await get('http://localhost:4000/get/')
        if (!result) throw new Error('获取id失败')
        const ids: string[] = result.data as string[]
        return ids
      } catch (e: unknown) {
        // 
      }
    }

    const getImages = async () => {
      try {
        while (true) {
          const result = await get('http://localhost:4000/picture/')
          if (!result) return
          if (result.data.finished) {
            break
          } else {
            const imageInfo = result.data
            dispatch({type: 'set', payload: imageInfo})
          }
        }
      } catch (e: unknown) {
        // 
      }
    }

    const popupUploader = () => {
        setPopup(true)
    }
    
    function rowRenderer({
      key, // Unique key within array of rows
      index, // Index of row within collection
      isScrolling, // The List is currently being scrolled
      isVisible, // This row is visible within the List (eg it is not an overscanned row)
      style, // Style object to be applied to row (to position it)
    }: any) {
      return (
        <div key={key} style={style}>
          <DisplayCard key={createKey()} imageInfo={state.images[key]} />
        </div>
      );
    }
    return (
        <Layout>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          style={{
            height: '100vh',
            borderRight: 0,
            fontSize: '18px'
          }}
          items={[{
            key: `1`,
            icon: React.createElement(CameraOutlined),
            label: 'Import Image',
            onClick: popupUploader
          }]}
        />
      </Sider>
      <Layout
        style={{
          padding: '0 24px 24px',
        }}
      >
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {/* <AutoSizer> */}
          <List
            width={300}
            height={300}
            rowCount={state.images.length}
            rowHeight={20}
            rowRenderer={rowRenderer} 
          />
          {/* </AutoSizer> */}
        </Content>
      </Layout>
    </Layout>
    <React.Suspense fallback={<div>loading....</div>}>
      <PopupContext.Provider value={popup}>
        <FileUpload popupSetter={setPopup} addImage={dispatch}/>
      </PopupContext.Provider>
    </React.Suspense>
  </Layout>
    )
}

// {state.images.map((image: IPictureModel) => {
//   return <DisplayCard key={createKey()} imageInfo={image} />
// })}

export { PopupContext }