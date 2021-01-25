import { FC } from 'react';
import { Modal, IModalProps } from '../../layout/modal';
import { Button } from '../../inputs';
import { Text, Padding, Shadows } from '../../constants';
import { IFrame } from '../../layout';
import { v4 as uuidv4 } from 'uuid';

const ModuleBorder = {
  border: '3px solid black',
}

interface IWelcomeWindowProps extends IModalProps {
  frames: IFrame[]
}

export const WelcomeWindow: FC<IWelcomeWindowProps> = ({ frames, ...props }) => {
  const mutators = props.mutators
    const createNewScene = () => {
      const newSceneUid = uuidv4()
      const newSceneFrames:IFrame[] = [
        {
          uid: "workarea",
          name: "workarea",
          enabled: true,
          transforms:{
            x:0,
            y:0,
            z:1,
            w:'100%',
            h:'100%',
          },
          modals:[
            {
              uid: "mainScene",
              canvasId: newSceneUid,
              modalName: "SceneRenderWindow",
              transforms:{
                x: 20,
                y: 20,
                w: 300,
                h: 300
              },
              draggable:true
            },
            {
              uid: uuidv4(),
              modalName: "SceneEditWindow",
              transforms:{
                x: 340,
                y: 40,
                w: 200,
                h: 300
              },
              draggable:true
            }       
          ]
        }  
      ];

      const renderingManager = mutators.getRenderingManager()
      renderingManager.createScene(
        { 
          uid: 'MainScene',
          canvasId: newSceneUid,
          name:'New Scene Test'
        }
      )

      const updatedFrames = frames.map((frame) => {
        frame.enabled = false
        return frame
    })
    mutators.setFrames([...updatedFrames].concat([...newSceneFrames]));
  }

  return (
    <Modal
      {...props}
      title="Welcome"
      extraStyle={{ ...Text.Small, ...Shadows.Global, ...ModuleBorder }}
    >
      <div style={{ ...Padding.Large, ...Text.Small }}>Please select an option...</div>
      <hr />
      <Button onClick={createNewScene}>Create New</Button>
      <Button>Load Project</Button>
      <hr />
    </Modal>
  )
}
