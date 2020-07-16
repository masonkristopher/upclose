import React, { FC, ReactElement, useState, useEffect, useRef } from 'react';

import Player from './Player';

type layout = 'red' | 'green' | 'blue' | 'yellow';
type dir = 'LEFT' | 'UP' | 'RIGHT' | 'DOWN';

interface RoomProps {
  name: string;
  layout: layout;
  changeRoom: (dir: dir) => void;
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  };
  positions: any;
  setPositions: any;
  socket: any;
}

interface direction {
  top: 0 | 1,
  left: 0 | 1,
  dir: dir,
}

enum layoutRef {
  red = 'bg-red-300',
  green = 'bg-green-300',
  blue = 'bg-blue-300',
  yellow = 'bg-yellow-300',
}

const Room: FC<RoomProps> = ({
  name,
  layout,
  user,
  changeRoom,
  socket,
}): ReactElement => {
  const [playerPosition, setPlayerPosition] = useState({
    top: Math.random() * 500,
    left: Math.random() * 500,
  });

  const maxDim = 500;
  const socketId = socket.id;

  const handlePlayerMovement = (direction: direction) => {
    const { top, left } = playerPosition;
    let newPlayerPosition;
    // eslint-disable-next-line default-case
    switch (direction.dir) {
      case 'UP':
        if (top <= 0) {
          newPlayerPosition = {
            top: top + 500,
            left,
          };
          // emit newPlayerPosition
          socket.emit('player moved', { [socketId]: newPlayerPosition });
          changeRoom('UP');
          setPlayerPosition(newPlayerPosition);
          return;
        }
        break;
      case 'DOWN':
        if (top >= maxDim - 40) {
          changeRoom('DOWN');
          setPlayerPosition({
            top: top - 500,
            left,
          });
          return;
        }
        break;
      case 'LEFT':
        if (left <= 0) {
          changeRoom('LEFT');
          setPlayerPosition({
            top,
            left: left + 500,
          });
          return;
        }
        break;
      case 'RIGHT':
        if (left >= maxDim - 40) {
          // change room right
          changeRoom('RIGHT');
          setPlayerPosition({
            top,
            left: left - 500,
          });
          return;
        }
        break;
    }

    // positions.socketId = 'newPosition';
    // setPositions({ ...positions });

    // maybe emit position here?
    // create a variable to hold the position,
    // emit that variable with socket.id
    // then set Player position
    // this is necessary anywhere we are setting player position
    setPlayerPosition({
      top: top + 5 * direction.top,
      left: left + 5 * direction.left,
    });
  };

  return (
    <div className={`w-full h-full inline-block ${layoutRef[layout]}`}>
      <Player user={user} position={playerPosition} handlePlayerMovement={handlePlayerMovement} />
      <div className="text-gray-800 mx-auto">
        {name}
      </div>
    </div>
  );
};

export default Room;
