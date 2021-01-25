import React, { FC, CSSProperties, useState } from 'react';
import { Modal, IModalProps, IModalTransforms } from '../modal';

import { Padding } from '../../constants/padding';
import { Text } from '../../constants/text';

import { WelcomeWindow, SceneRenderWindow, SceneEditWindow } from '../../windows';

const FrameStyle: CSSProperties = {
  position: 'absolute',
  display: 'block',
  backgroundColor: 'transparent',
  ...Padding.Small,
  ...Text.Small,
  pointerEvents: 'none',
};

export interface IFrame {
  uid: string
  name?: string
  enabled: boolean
  transforms?: IFrameTransforms
  modals?: IModalProps[]
}

interface IFrameProps extends IFrame {
  frames: IFrame[]
  mutators: any
}

export interface IFrameTransforms {
  x?: number | string;
  y?: number | string;
  z?: number;
  w?: number | string;
  h?: number | string;
}

const recursiveGetModal = (el)=>{
  return el.parentNode
}

const recursiveGetFrame = (el)=>{
  return el.parentNode.parentNode
}

const getFrameTransformFromBoundingData = (target)=>{
  const rect = target.getBoundingClientRect()

  const trans: IModalTransforms = {
    x : target.style.left ?? rect.x ?? 0,
    y : target.style.top ?? rect.y ?? 0,
    z : parseInt(target?.style?.zIndex) ?? 0,
    w : target.style.width ?? rect.width ?? 'auto',
    h : target.style.height ?? rect.height ?? 'auto'
  }
  return trans
}

const getModalTransformFromBoundingData = (target)=>{ 
  const rect = target.getBoundingClientRect()

  const trans: IModalTransforms = {
    x : rect.x ?? 0,
    y : rect.y ?? 0,
    z : parseInt(target?.style?.zIndex) ?? 0,
    w : target.style.width ?? rect.width ?? 'auto',
    h : target.style.height ?? rect.height ?? 'auto'
  }
  return trans
}

const getParentFrameBoundingData = (el)=>{
  return el.getBoundingClientRect()
}
const getModuleBoundingData = (el)=>{
  return el.getBoundingClientRect()
}

export const Frame: FC<IFrameProps> = ({ enabled, transforms, modals, frames, mutators, ...frameData}) => {
  
  const [frameStyle] = useState<CSSProperties>({
    ...FrameStyle,
    left: transforms ? transforms.x ?? 0 : 0,
    top: transforms ? transforms.y ?? 0 : 0,
    zIndex: transforms ? transforms.z ?? 0 : 0,
    width: transforms ? transforms.w ?? 'auto' : 'auto',
    height: transforms ? transforms.h ?? 'auto' : 'auto'
  })

  const updateModalTransforms = (frameUid, modalUid, data)=>{
    if(!enabled){
      return false
    }
    const updateFrames = frames.map(f=>{
      if(f.uid === frameUid){ 
        const fModals = f.modals?.map(m=>{
          if(m.uid === modalUid){
            const modalDom = document.getElementById(modalUid) 
            
            if(!m.transforms){
              m.transforms = getModalTransformFromBoundingData(modalDom)
            }

            const frame = document.getElementById(frameUid)
            const parentBox:DOMRect = getParentFrameBoundingData(frame)
            const modalBox:DOMRect =  getModuleBoundingData(modalDom) 

            m.transforms.x = Math.min(Math.max(0, m.transforms.x + data.diff.x), parentBox.width - modalBox.width)
            m.transforms.y = Math.min(Math.max(0, m.transforms.y + data.diff.y), parentBox.height - modalBox.height)
          }       
          return m
        })
        f.modals = fModals ?? []
      }
      return f
    })
    mutators.setFrames(updateFrames)
  }

  mutators.updateModalTransforms = updateModalTransforms

  return enabled ? (
    <div className='frame' style={frameStyle} id={frameData.uid}>
      {modals &&
        modals.length > 0 &&
        modals.map((modal, index) => {
          if(modal.enabled === undefined){modal.enabled = true}
          return (
            <React.Fragment key={index}>
              {modal.modalName === "WelcomeWindow" && <WelcomeWindow key={modal.uid} {...modal} frames={frames} mutators={mutators} frameData={frameData} />}
              {modal.modalName === "SceneRenderWindow" && <SceneRenderWindow key={modal.uid} {...modal} frames={frames} mutators={mutators} frameData={frameData} />}
              {modal.modalName === "SceneEditWindow" && <SceneEditWindow key={modal.uid} {...modal} frames={frames} mutators={mutators} frameData={frameData} />}
              {!modal.modalName && <Modal key={index} {...modal} mutators={mutators} frames={frames} frameData={frameData} />}
            </React.Fragment>
          );
        })}
    </div>
  ) : null;
};
