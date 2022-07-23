import React, { ChangeEvent, MouseEvent, useEffect, useReducer, useRef, useState } from 'react'
import { Layout, Button, Divider, Radio, Tag, Select, InputNumber, Modal } from 'antd'
import { ScissorOutlined, EditOutlined, HighlightOutlined, BgColorsOutlined, BarsOutlined, UploadOutlined, RedoOutlined, StopOutlined } from '@ant-design/icons';
import Input, { InputRef } from 'antd/lib/input/Input';
import { textProcessor } from '../utils/textProcessor'
import { saveImage } from '../utils/saveImage'
import { paintingProcessor } from '../utils/paintingProcessor'
import { clipProcessor } from '../utils/clipProcessor'
import { rotateProcessor } from '../utils/rotateProsessor'


const { Sider, Content } = Layout
const { Option } = Select

interface Texts {
    color: string,
    font: string,
    size: number,
    pos: [number, number],
    text: string
}

interface Paintings {
    color: string,
    width: number,
    isDottedLine: boolean,
    points: Array<[number, number]>
}
interface PaintingState {
    paintings: Array<Paintings>
}
interface TextState {
    texts: Array<Texts>
}
interface EditingState {
    paintingState: PaintingState,
    textState: TextState
}

const editingState: EditingState = {
    paintingState: {
        paintings: []
    },
    textState: {
        texts: []
    }
}

type Position = [number, number]

type Process = 'none' | 'writing' | 'painting' | 'cliping' | 'rotate'

const fonts = ['宋体', '新細明體', '細明體', '標楷體', '黑体', '新宋体', '仿宋', '楷体', '仿宋_GB2312', '楷体_GB2312', '微軟正黑體']
const processToCursor = new Map<Process, string>([
    ['cliping', 'crosshair'],
    ['writing', 'text'],
    ['none', ''],
    ['painting', 'crosshair'],
    ['rotate', '']
  ])

let textPos: Position = [0, 0]
let paintingPos: Position = [0, 0]
let startClipingPos: Position = [0, 0]
let endClipingPos: Position = [0, 0]
let mainCtx: CanvasRenderingContext2D 
let coverCtx: CanvasRenderingContext2D

export default () => {
    const [currentImage, setCurrentImage] = useState('')
    const mainBoard = useRef<HTMLCanvasElement>(null)
    const coverBoard = useRef<HTMLCanvasElement>(null)
    const inputerRef = useRef<InputRef>(null)
    const [ongoingProcess, setOngoingProcess] = useState<Process>('none')
    const [startWriting, setStartWriting] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [color, setColor] = useState('black')
    const [text, setText] = useState('')
    const [font, setFont] = useState('宋体')
    const [size, setSize] = useState(20)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const [lineWidth, setLineWidth] = useState(1)
    const [isLineDotted, setIsLineDotted] = useState(false)
    useEffect(() => {
        initializePage()
    }, [])

    useEffect(() => {
        if (!coverBoard.current) return
        coverBoard.current.style.cursor = processToCursor.get(ongoingProcess) as string
    }, [ongoingProcess])

    useEffect(() => {
        const inputer: HTMLInputElement = document.querySelector('.text-inputer') as HTMLInputElement
        if (!inputerRef.current?.input || !inputer) return
        inputer.style.left = textPos[0] + 'px'
        inputer.style.top = textPos[1] + 'px'
        inputer.style.color = color
    }, [startWriting])

    const initializePage = () => {
        if (mainBoard.current) {
            const tempMainCtx = mainBoard.current.getContext('2d')
            if (tempMainCtx) {
                mainCtx = tempMainCtx
            }
        }
        if (coverBoard.current) {
            const tempCoverCtx = coverBoard.current.getContext('2d')
            if (tempCoverCtx) {
                coverCtx = tempCoverCtx
            }
        }
        getCurrentImage()
    }

    const getCurrentImage = () => {
        const imageUrl = localStorage.getItem('imageUrl')
        // while (!imageUrl) continue
        if (imageUrl) {
            setCurrentImage(imageUrl)
            loadImage(imageUrl)
        }
    }

    const loadImage = (imageUrl: string) => {
        const image = new Image()
        image.src = imageUrl
        if (mainBoard.current && coverBoard.current) {
            mainBoard.current.width = image.width
            coverBoard.current.width = image.width
            mainBoard.current.height = image.height
            coverBoard.current.height = image.height
        }
        mainCtx.drawImage(image, 0, 0)
    }

    const handleClipingButtonClick = () => {
        setOngoingProcess('cliping')
        if (!coverBoard.current) return
        clipProcessor.drawShadow(coverCtx, [0, 0], [coverBoard.current.width, coverBoard.current.height])
    }

    const handleWritingButtonClick = () => {
        setOngoingProcess('writing')
    }

    const handlePaintingButtonClick = () => {
        setOngoingProcess('painting')
    }

    const handleRotateRightButtonClick = () => {
        setOngoingProcess('rotate')
        rotateRight()
    }

    const handleResetButtonClick = () => {
        setOngoingProcess('none')
        initializePage()
    }

    const rotateRight = () => {
        if (!mainBoard.current) return
        rotateProcessor.rotateRight(mainCtx, mainBoard.current, currentImage)
    }

    const handleCoverClick = (e: MouseEvent) => {
        const X = e.nativeEvent.offsetX
        const Y = e.nativeEvent.offsetY
        if (ongoingProcess === 'writing') {
            textPos[0] = X
            textPos[1] = Y
            setStartWriting(true)
        }
        if (ongoingProcess === 'painting') {
            if (!coverBoard.current) return
            paintingPos = [X, Y]
            paintingProcessor.startPainting(paintingPos)
            coverBoard.current.addEventListener('mousemove', startPainting)
            coverBoard.current.addEventListener('mouseup', stopPainting)
        }
        if (ongoingProcess === 'cliping') {
            if (!coverBoard.current) return
            startClipingPos = [X, Y]
            coverBoard.current.addEventListener('mousemove', startCliping)
            coverBoard.current.addEventListener('mouseup', stopCliping)
        }
    }

    const startCliping = (e: any) => {
        if (!coverBoard.current) return
        const [X, Y] = [e.offsetX, e.offsetY]
        clipProcessor.drawShadow(coverCtx, [0, 0], [coverBoard.current.width, coverBoard.current.height])
        clipProcessor.drawRectangle(coverCtx, startClipingPos, [X, Y])
    }

    const stopCliping = (e: any) => {
        if (!coverBoard.current || !mainBoard.current) return
        endClipingPos = [e.offsetX, e.offsetY]
        cleanListeners(coverBoard.current)
        setOngoingProcess('none')
        coverCtx.clearRect(0, 0, 10000, 1000)
        clipProcessor.clipImage(mainBoard.current, mainCtx, mainBoard.current.toDataURL(), startClipingPos, endClipingPos, () => {
            if (!mainBoard.current) return
            setCurrentImage(mainBoard.current.toDataURL())
        })
    }

    const startPainting = (e: any) => {
        const [X, Y] = [e.offsetX, e.offsetY]
        paintingProcessor.paint(mainCtx, [X, Y], color, lineWidth, isLineDotted)
    }

    const stopPainting = () => {
        if (!coverBoard.current) return
        cleanListeners(coverBoard.current)
        setOngoingProcess('none')
        const points = [...paintingProcessor.points]
        editingState.paintingState.paintings.push({
            color,
            width: lineWidth,
            isDottedLine: isLineDotted,
            points
        })
        if (!mainBoard.current) return
        setCurrentImage(mainBoard.current.toDataURL())
    }

    const cleanListeners = (target: HTMLCanvasElement) => {
        if (!target) return
        if (ongoingProcess === 'painting') {
            target.removeEventListener('mousemove', startPainting)
            target.removeEventListener('mouseup', stopPainting)
        } else if (ongoingProcess === 'cliping') {
            target.removeEventListener('mousemove', startCliping)
            target.removeEventListener('mouseup', stopCliping)
        }
    }

    const handleTextChange = (e: any) => {
        if (e.key === 'Enter') {
            textProcessor.addText(mainCtx, text, textPos, color, size, font)
            setOngoingProcess('none')
            setStartWriting(false)
            editingState.textState.texts.push({
                color,
                font,
                size,
                text,
                pos: textPos
            })
            textPos = [0, 0]
            setText('')
            if (!mainBoard.current) return
            setCurrentImage(mainBoard.current.toDataURL())
        }
        if (e.key === 'Escape') {
            setOngoingProcess('none')
            setStartWriting(false)
            setText('')
        }
        const value = e.target.value
        setText(value)
    }

    const handleSaveButtonClick = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }
    const handleNameChange = (e: any) => {
        const value = e.target.value
        setName(value)
    }

    const handleDescriptionChange = (e: any) => {
        const value = e.target.value
        setDescription(value)
    }

    const handleTagsChange = (e: any) => {
        const value = e.target.value
        setTags(value)
    }

    const handleConfirm = () => {
        if (!mainBoard.current) return
        saveImage.save(mainBoard.current, name, description, tags)
        setName('')
        setDescription('')
        setTags('')
        setIsModalVisible(false)
    }

    const changeColor = (color: string) => {
        setColor(color)
    }

    const changeLineWith = (value: number) => {
        setLineWidth(value)
    }

    const changeLineDotted = (val: boolean) => {
        setIsLineDotted(val)
    }

    const changeFont = (font: string) => {
        setFont(font)
    }

    const changeFontSize = (size: number) => {
        setSize(size)
    }

    return <Layout>
        <Sider
            width={300}
            style={{
                height: '100vh'
            }}
        >
            <Divider>编辑</Divider>
            <Content className="edit-button-wrapper">
                <Button size="large" icon={<ScissorOutlined />} onClick={handleClipingButtonClick}>
                    裁剪
                </Button>
                <Button size="large" icon={<ScissorOutlined />} onClick={handleWritingButtonClick}>
                    文字
                </Button>
                <Button size="large" icon={<ScissorOutlined />} onClick={handlePaintingButtonClick}>
                    画笔
                </Button>
                <Button size="large" icon={<ScissorOutlined />} onClick={handleRotateRightButtonClick}>
                    旋转
                </Button>
                <Button size="large" icon={<ScissorOutlined />} onClick={handleResetButtonClick}>
                    还原
                </Button>
                <Button size="large" icon={<ScissorOutlined />} onClick={handleSaveButtonClick}>
                    保存
                </Button>
            </Content>
            <Divider>属性</Divider>
            <Content className="color-radio-wrapper">
                <Tag>颜色</Tag>
                <Button size="large" style={{backgroundColor: 'black'}} onClick={() => {changeColor('black')}}>
                    <BgColorsOutlined />
                </Button>
                <Button size="large" style={{backgroundColor: '#f50'}} onClick={() => {changeColor('#f50')}}>
                    <BgColorsOutlined />
                </Button>
                <Button size="large" style={{backgroundColor: '#2db7f5'}} onClick={() => {changeColor('#2b7f5')}}>
                    <BgColorsOutlined />
                </Button>
                <Button size="large" style={{backgroundColor: '#87d068'}} onClick={() => {changeColor('#87d068')}}>
                    <BgColorsOutlined />
                </Button>
                <Button size="large" style={{backgroundColor: '#108ee9'}} onClick={() => {changeColor('#108ee9')}}>
                    <BgColorsOutlined />
                </Button>
            </Content>
            <Content className="bald-picker-wrapper">
                <Tag className="bald-tag">线条粗细</Tag>
                <Select defaultValue={1} style={{width: 60, height: 32, paddingLeft: 10}} onChange={(value: number) => {changeLineWith(value)}}>
                    {Array(20).fill(1).map((item: number, index: number) => {
                        return <Option value={index + 1} key={index}>{index + 1}</Option>
                    })}
                </Select>
            </Content>
            <Content>
                <Button size="large" onClick={() => changeLineDotted(false)}>
                    实线
                </Button>
                <Button size="large" style={{borderStyle: 'dotted', marginLeft: 10}} onClick={() => {changeLineDotted(true)}}>
                    虚线
                </Button>
            </Content>
            <Divider>文字</Divider>
            <Select defaultValue='宋体' style={{width: 80, height: 32, marginLeft: 10, marginRight: 10}} onChange={(font: string) => {changeFont(font)}}>
                    {fonts.map((font: string) => {
                        return <Option value={font} key={font}>{font}</Option>
                    })}
            </Select>
            <Tag>大小</Tag>
            <InputNumber min={1} max={100} defaultValue={10} onChange={(size: number) => {changeFontSize(size)}} />
        </Sider>
        <Layout>
            <Content
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                <div className="canvas-container">
                    <canvas id="main-board" ref={mainBoard}></canvas>
                    <canvas 
                        id="cover-board" 
                        ref={coverBoard}
                        onMouseDown={(e: MouseEvent) => {handleCoverClick(e)}}
                    ></canvas>
                    {startWriting && <Input className="text-inputer" ref={inputerRef} onKeyUp={handleTextChange}></Input>}
                </div>
            </Content>
        </Layout>
        <Modal
            visible={isModalVisible}
            title="上传图片"
            // onOk={saveImage}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>取消</Button>,
                <Button key="save" onClick={handleConfirm}>保存</Button>
            ]}
        >
            <Input placeholder="请输入照片名称" size="large" prefix={<BarsOutlined />} onChange={handleNameChange}></Input>
            <br />
            <br />
            <Input placeholder="请输入照片描述" size="large" prefix={<BarsOutlined />} onChange={handleDescriptionChange}></Input>
            <br />
            <br />
            <Input placeholder="请输入照片标签" size="large" prefix={<BarsOutlined />} onChange={handleTagsChange}></Input>
        </Modal>
    </Layout>
}