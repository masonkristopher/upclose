import React, { FC, ReactElement, useEffect } from 'react';

import PartyGoer from './PartyGoer';

import { Position } from '../services/constants';

interface PlayerProps {
  handlePlayerMovement: any;
  position: Position;
}

const House: FC<PlayerProps> = ({
  handlePlayerMovement,
  position,
}): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent) => {
    let newDirection;
    switch (event.keyCode) {
      case 37:
        event.preventDefault();
        newDirection = { top: 0, left: -1, dir: 'LEFT' };
        break;
      case 38:
        event.preventDefault();
        newDirection = { top: -1, left: 0, dir: 'UP' };
        break;
      case 39:
        event.preventDefault();
        newDirection = { top: 0, left: 1, dir: 'RIGHT' };
        break;
      case 40:
        event.preventDefault();
        newDirection = { top: 1, left: 0, dir: 'DOWN' };
        break;
      default:
        return;
    }
    handlePlayerMovement(newDirection);
  };

  useEffect(() => {
    window.onkeydown = handleKeyDown;
  });

  return (
    <PartyGoer position={position} />
  );
};

export default House;
