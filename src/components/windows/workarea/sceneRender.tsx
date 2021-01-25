import { FC } from 'react';
import { Modal, IModalProps } from '../../layout/modal';
import { Text, Padding, Shadows } from '../../constants';
import { IFrame } from '../../layout';
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from '@babylonjs/core';
import { SceneComponent } from '../../babylon/scene'; 

const ModuleBorder = {
  border: '3px solid black',
  overflow: 'hidden'
}

interface ISceneRenderWindowProps extends IModalProps {
  frames: IFrame[],
  canvasId?: string
}

export const SceneRenderWindow: FC<ISceneRenderWindowProps> = ({ frames, ...props }) => {
  const mutators = props.mutators
  const rm = mutators.getRenderingManager()
  const scene = rm.getScene("MainScene")
  if(!scene.initialized){
    scene.onInit = ()=>{
      const box = MeshBuilder.CreateBox("box", {size: 1}, scene.context)
      const light = new HemisphericLight("mainLight", new Vector3(-0.5, -1, 0.3), scene.context)
      scene.context.cameras[0].position.z = -4
      scene.context.onBeforeRenderObservable.add(()=>{
        box.rotate(Vector3.Up(), scene.context.getEngine().getDeltaTime()*0.001)
      })
      scene.initialized = true
    }
  }  
  return (
    <Modal
      {...props}
      title="Main Render"
      extraStyle={{ ...Text.Small, ...Shadows.Global, ...ModuleBorder }}
    >    
    <canvas id={`canvas-${props.canvasId ?? props.uid}`} style={{position:'absolute', width:'100%', height:'100%', touchAction:'none'}}/>
    </Modal>
  )
}






