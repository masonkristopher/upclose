import React, { FC, ReactElement, useEffect } from 'react';

import PartyGoer from './PartyGoer';

interface position {
  top: number,
  left: number,
}

interface PlayerProps {
  handlePlayerMovement: any;
  position: position;
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  };
}

const House: FC<PlayerProps> = ({
  user,
  position,
  handlePlayerMovement,
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
    <div className="">
      <PartyGoer user={user} position={position} />
    </div>
  );
};

export default House;
