import { FC, CSSProperties, useEffect, useCallback, useRef } from 'react';
import {Colors, Padding, Text} from '../../constants'
import {Nullable, Vector2} from '@babylonjs/core'

const modalHeadStyle: CSSProperties = {
    position: "relative",
    display: "block",
    backgroundColor: Colors.MenuBackgroundDark,
    ...Padding.Small,
    ...Text.Small,
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none'
}

const modalTitleStyle: CSSProperties = {
    position: "relative",
    display: "block",
    ...Text.Small,
    fontWeight:"bold",
    pointerEvents:"none",
    paddingLeft:Padding.Large.paddingLeft
}

interface IModalHeaderProps {
    title?: string
    draggable?: boolean
    minable?: boolean
    closable?: boolean
    mutators?: any
    frames?:any
}

interface IDragControls{
    lastSafePoint: Nullable<Vector2>
}

const dragControls:IDragControls = {
    lastSafePoint:null
}

export const ModalHeader: FC<IModalHeaderProps> = ({title, draggable, minable, closable, mutators, ...rest}) => {
    
    const frameData = {...(rest as any).frameData}
    const modalData = {...(rest as any).modalData}

    const headStyle = {
        ...modalHeadStyle,
        ...((draggable)?{cursor:"pointer"}:{})
    }

    const headRef = useRef<string>()

    // useEffect(()=>{
    //     if(!dragControls.dragStart){
    //         dragControls.dragStart = (draggable)?(e)=>{   
    //             console.log 
    //             document.addEventListener('mousemove', dragControls.runObs, true) 
    //             document.addEventListener('mouseout', dragControls.releaseObs, true) 
    //             document.addEventListener('mouseup', dragControls.releaseObs, true)
    //         }:()=>{}
    //         dragControls.dragEnd = (draggable)?(e)=>{
    //             document.removeEventListener('mousemove', dragControls.runObs, true)
    //             document.removeEventListener('mouseout', dragControls.releaseObs, true)
    //             document.removeEventListener('mouseup', dragControls.releaseObs, true)
    //             dragControls.lastSafePoint = null
    //         }:()=>{}

    //         dragControls.releaseObs = (e)=>{
    //             if ((e.toElement == null && e.relatedTarget == null) || e.type === "mouseup") {
    //                 dragControls.dragEnd(e)
    //                 dragControls.dragEnd = ()=>{}
    //                 dragControls.runObs = null
    //                 dragControls.releaseObs = null
    //                 dragControls.dragStart = ()=>{}
    //                 dragControls.lastSafePoint = null
    //             }           
    //         }

    //         dragControls.runObs = (e)=>{                     
    //             if(!dragControls.lastSafePoint){
    //                 dragControls.lastSafePoint = new Vector2(e.clientX, e.clientY)
    //             }
    //             let currentPoint = new Vector2(e.clientX, e.clientY)
    //             let diff = currentPoint.subtract( dragControls.lastSafePoint )
    //             mutators.updateModalTransforms(frameData.uid, modalData.uid, {diff, e})            
    //             dragControls.lastSafePoint = currentPoint 
    //         }
    //     }
    // },[mutators])

    const onDragStart = useCallback((e) => {
        e.stopPropagation()
        e.preventDefault()
        if(e.target.getAttribute('id') !== modalData.uid){  
            return false;
        }
        dragControls.lastSafePoint = null 
        window.addEventListener('mousemove', onDrag) 
    }, [])

    const onDragOver = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation() 
        window.removeEventListener('mousemove', onDrag)
        dragControls.lastSafePoint = null 
        return false
    }, [])

    const onDrag = useCallback((e) => {
        e.stopPropagation()
        e.preventDefault()
        if(!dragControls.lastSafePoint){
            dragControls.lastSafePoint = new Vector2(e.clientX, e.clientY)
        }
        let currentPoint = new Vector2(e.clientX, e.clientY)
        let diff = currentPoint.subtract( dragControls.lastSafePoint )
        mutators.updateModalTransforms(frameData.uid, modalData.uid, {diff, e})            
        dragControls.lastSafePoint = currentPoint
    }, [])

    useEffect(() => {
        window.addEventListener('mousedown', onDragStart)
        window.addEventListener('mouseup', onDragOver)
        window.addEventListener('mouseleave', onDragOver)
        return () => {
            window.removeEventListener('mousedown', onDragStart)
            window.removeEventListener('mouseup', onDragOver)
            window.removeEventListener('mouseleave', onDragOver)
        };
    }, [onDragStart, onDragOver, onDrag])

    return (
        (draggable || title)?
        <div className="modal-head" style={headStyle} id={modalData.uid}>
            <div className="modal-title" style={modalTitleStyle}>
                {title ?? <></>}
            </div>
            <div className="modal-controls">
            </div>
        </div>:
        <></>
    )
}