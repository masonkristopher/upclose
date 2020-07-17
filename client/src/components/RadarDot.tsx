import React, { FC, ReactElement, useState, useEffect } from 'react';

import { Position } from '../services/constants';
import { CSSProperties } from 'styled-components';

interface RadarDotProps {
  position: Position;
}

const RadarDot: FC<RadarDotProps> = ({
  position,
}): ReactElement => {
  const createStyle = (): CSSProperties => {
    let { top, left, currentRoom } = position;
    top /= 20;
    left /= 20;

    if (currentRoom === 'red') {

    } else if (currentRoom === 'blue') {

    } else if (currentRoom === 'green') {

    } else if (currentRoom === 'yellow') {

    }

    return {
      height: '3px',
      width: '3px',
      backgroundColor: 'black',
    };
  }


  return (
    <div className="relative" style={createStyle()} />
  );
};

export default RadarDot;
