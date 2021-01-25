import { FC, useState } from 'react';
import { Modal, IModalProps } from '../../layout/modal';
import { Text, Shadows, Padding } from '../../constants';
import { IFrame } from '../../layout';
import { Slider } from '@material-ui/core'


const ModuleBorder = {
  border: '3px solid black',
  overflow: 'hidden'
}

interface ISceneEditWindowProps extends IModalProps {
  frames: IFrame[]
}

export const SceneEditWindow: FC<ISceneEditWindowProps> = ({ frames, ...props }) => {
  const mutators = props.mutators
  const rm = mutators.getRenderingManager()
  const scene = rm.getScene("MainScene")  

  const Menu = ()=>{
    const box = scene.context.meshes[0]
    const [bY, setBY] = useState<number>(box.position.y)
    const handleChange = (event, newValue) => {
        setBY(newValue)
        box.position.y = newValue
    }

    return (
        <div style={{...Padding.Large}}>
            <Slider value={bY} onChange={handleChange} aria-labelledby="continuous-slider" min={0} max={2} step={0.01} />
        </div>
    )
  }

  return (
    <Modal
      {...props}
      title="Scene Edit"
      extraStyle={{ ...Text.Small, ...Shadows.Global, ...ModuleBorder }}
    >    
    {scene.initialized && <Menu />}
    </Modal>
  )
}






