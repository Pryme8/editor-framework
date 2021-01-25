import React, { FC } from 'react';
import { Frame, IFrame } from './frame';

interface IFrameManagerProps {
  frames: IFrame[];
  mutators: any;
}

export const FrameManager: FC<IFrameManagerProps> = ({ frames, mutators }) => {

  return (
    <>
      {frames.map((frame, index) => {
        return (
          <Frame
            key={frame.uid}
            {...frame}
            frames={frames}
            mutators={mutators}
          />
        );
      })}
    </>
  );
};
