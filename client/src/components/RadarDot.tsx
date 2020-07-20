import React, { FC, ReactElement } from 'react';
import { CSSProperties } from 'styled-components';

import { Position } from '../services/constants';

interface RadarDotProps {
  calibration?: number;
  color: 'black' | 'red';
  position: Position;
  rooms: (string | undefined)[];
}

const RadarDot: FC<RadarDotProps> = ({
  calibration = 0,
  color,
  position,
  rooms,
}): ReactElement => {
  const styleDot = (): CSSProperties => {
    const { currentRoom } = position;
    let { top, left } = position;
    top /= 10;
    left /= 10;

    if (currentRoom === rooms[0]) {
      top += 0;
      left += 0;
    } else if (currentRoom === rooms[1]) {
      top += 0;
      left += 50;
    } else if (currentRoom === rooms[2]) {
      top += 50;
      left += 0;
    } else if (currentRoom === rooms[3]) {
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
