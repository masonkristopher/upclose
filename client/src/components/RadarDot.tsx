import React, { FC, ReactElement } from 'react';
import { CSSProperties } from 'styled-components';

import { Position } from '../services/constants';

interface RadarDotProps {
  calibration?: number;
  color: 'black' | 'red';
  position: Position;
}

const RadarDot: FC<RadarDotProps> = ({
  calibration = 0,
  color,
  position,
}): ReactElement => {
  const styleDot = (): CSSProperties => {
    const { currentRoom } = position;
    let { top, left } = position;
    top /= 10;
    left /= 10;

    if (currentRoom === 'red') {
      top += 0;
      left += 0;
    } else if (currentRoom === 'blue') {
      top += 0;
      left += 50;
    } else if (currentRoom === 'green') {
      top += 50;
      left += 0;
    } else if (currentRoom === 'yellow') {
      top += 50;
      left += 50;
    }

    return {
      height: '5px',
      width: '5px',
      backgroundColor: color,
      top: `${top - calibration}px`,
      left: `${left}px`,
    };
  };

  return (
    <div className="relative z-10 rounded-ful" style={styleDot()} />
  );
};

export default RadarDot;
