import React, { FC, ReactElement, useState } from 'react';

import Player from './Player';

import { User } from '../services/constants';
import PartyGoer from './PartyGoer';

type dir = 'LEFT' | 'UP' | 'RIGHT' | 'DOWN';
interface direction {
  top: 0 | 1;
  left: 0 | 1;
  dir: dir;
}
enum RoomStyles {
  red = 'bg-red-300',
  green = 'bg-green-300',
  blue = 'bg-blue-300',
  yellow = 'bg-yellow-300',
}
interface RoomProps {
  name: 'red' | 'green' | 'blue' | 'yellow';
  changeRoom: (dir: dir) => void;
  user: User;
  socket: SocketIOClient.Socket;
  positions: any;
  setPositions: any;
}

const Room: FC<RoomProps> = ({
  name,
  // user,
  changeRoom,
  socket,
  positions,
  setPositions,
}): ReactElement => {
  // const [playerPosition, setPlayerPosition] = useState({
  //   top: Math.random() * 500,
  //   left: Math.random() * 500,
  // });

  const emitPosition = (newPlayerPosition: any) => {
    socket.emit('player moved', { [socket.id]: newPlayerPosition });
  };

  // room size
  const maxDim = 500;

  const handlePlayerMovement = (direction: direction) => {
    // existing coordinates
    const playerPosition = positions[socket.id];
    const { top, left } = playerPosition;
    // boundary movement
    switch (direction.dir) {
      case 'UP':
        if (top <= 0) {
          // const newPlayerPosition = { top: top + maxDim, left };
          playerPosition.top = top + maxDim;
          changeRoom('UP');
          // emitPosition(newPlayerPosition);
          emitPosition(playerPosition);
          setPositions({ ...positions });
          return;
        }
        break;
      case 'DOWN':
        if (top >= maxDim - 40) {
          // const newPlayerPosition = { top: top - maxDim, left };
          playerPosition.top = top - maxDim;
          changeRoom('DOWN');
          // emitPosition(newPlayerPosition);
          // setPlayerPosition(newPlayerPosition);
          emitPosition(playerPosition);
          setPositions({ ...positions });
          return;
        }
        break;
      case 'LEFT':
        if (left <= 0) {
          // const newPlayerPosition = { top, left: left + maxDim };
          playerPosition.left = left + maxDim;
          changeRoom('LEFT');
          // emitPosition(newPlayerPosition);
          // setPlayerPosition(newPlayerPosition);
          emitPosition(playerPosition);

          setPositions({ ...positions });
          return;
        }
        break;
      case 'RIGHT':
        if (left >= maxDim - 40) {
          // const newPlayerPosition = { top, left: left - maxDim };
          playerPosition.left = left - maxDim;
          changeRoom('RIGHT');
          // emitPosition(newPlayerPosition);
          // setPlayerPosition(newPlayerPosition);
          emitPosition(playerPosition);
          setPositions({ ...positions });
          return;
        }
        break;
      default:
        break;
    }

    // normal field movement
    playerPosition.top = top + 5 * direction.top;
    playerPosition.left = left + 5 * direction.left;
    // const newPlayerPosition = {
    //   top: top + 5 * direction.top,
    //   left: left + 5 * direction.left,
    // };
    // emitPosition(newPlayerPosition);
    // setPlayerPosition(newPlayerPosition);
    emitPosition(playerPosition);
    setPositions({ ...positions });
  };

  return (
    <div className={`relative w-full h-full inline-block ${RoomStyles[name]}`}>
      <Player position={positions[socket.id]} handlePlayerMovement={handlePlayerMovement} />
      {Object.keys(positions).filter(socketId => socketId !== socket.id).map((socketId, i) => {
        return (
          <PartyGoer key={socketId} position={positions[socketId]} calibration={(i + 1) * 40} />
        );
      })}
    </div>
  );
};

export default Room;
