import React, { CSSProperties, FC, useState, useEffect } from 'react';
import { Colors } from './components/constants';
import { IFrame } from './components/layout/frame/frame';
import { FrameManager } from './components/layout/frame/frameManager';
import { v4 as uuidv4 } from 'uuid';
import { RenderingManager } from './renderingManager/renderingManager'

const EditorStyle: CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  display: 'block',
  backgroundColor: Colors.OffWhite,
};

const BabylonRender = new RenderingManager({})

export const Editor: FC = () => {
  const [frames, setFrames] = useState<IFrame[]>([
    {
      uid: 'home',
      name: 'home-frame',
      enabled: true,
      transforms: {
        w: '100%',
        h: '100%'
      },
      modals: [
        {
          uid: uuidv4(),
          modalName: 'WelcomeWindow',
          enabled: true,         
          draggable: true,
          transforms:{
            x:0,
            y:0
          }
        },
      ],
    },
  ]);

  const Mutators = {
    getRenderingManager:()=>{
      return BabylonRender
    }, 
    setFrames   
  }

  // useEffect(() => {
  //   console.log('frames updated', frames);
  // }, [frames]);

  return (
    <div className='Editor' style={EditorStyle}>
      {frames.length && <FrameManager frames={frames} mutators={Mutators}  />}
    </div>
  );
};
