import { FC, useState, useEffect, CSSProperties } from 'react';
import { Colors } from '../../constants';
import { ModalHeader } from './modalHeader';

const modalStyle: CSSProperties = {
  position: 'relative',
  display: 'block',
  pointerEvents: 'initial',
  backgroundColor: Colors.MenuBackgroundLight,
};

export interface IModalProps {
  uid: string
  modalName?: string
  title?: string
  enabled?: boolean
  locked?: boolean
  transforms?: IModalTransforms
  draggable?: boolean
  minable?: boolean
  closable?: boolean
  absCenter?: boolean
  extraStyle?: any
  frames?: any
  frameData?: any
  mutators?: any
  canvasId?: string
}

export interface IModalTransforms {
  x?: number | string;
  y?: number | string;
  z?: number;
  w?: number | string;
  h?: number | string;
}

export const Modal: FC<IModalProps> = ({
  uid,
  modalName,
  title,
  enabled,
  locked,
  transforms,
  draggable,
  minable,
  closable,
  absCenter,
  extraStyle,
  children,
  frameData,
  mutators,
  ...rest
}) => {

  const [currentModalStyle, setCurrentModalStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const styles: CSSProperties = { ...modalStyle };
    if (absCenter) {
      styles.position = 'absolute';
      styles.left = '50%';
      styles.top = '50%';
      styles.transform = 'translate(-50%, -50%)';
    }

    if (draggable) {
      styles.position = 'absolute'
      styles.left = transforms?.x ?? 0;
      styles.top = transforms?.y ?? 0;
      styles.zIndex = transforms?.z ?? 0;
      styles.width = transforms?.w ?? 'auto';
      styles.height = transforms?.h ?? 'auto';
      styles.WebkitBoxShadow = '1px 1px 3px 1px rgba(60,60,60,0.2)';
      styles.boxShadow = '1px 1px 3px 1px rgba(60,60,60,0.2)';
      styles.transform = '';
    }   
    setCurrentModalStyle({ ...styles, ...extraStyle });
  }, [absCenter, draggable, extraStyle, transforms]);

   return enabled ? (
    <div className='modal' style={currentModalStyle} id={uid}>
      <ModalHeader
        title={title}
        draggable={draggable ?? false}
        minable={minable ?? false}
        closable={closable ?? false}
        mutators={mutators}  
        {...{frameData:{...frameData}, modalData:{uid, modalName}}}
      />
      {children}
    </div>
  ) : null;
};
