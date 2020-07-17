import React, { FC, ReactElement } from 'react';
import { CSSProperties } from 'styled-components';

import Player from './Player';

import {
  Peers,
  Position,
  Positions,
  house,
  roomSize,
  Dir,
  Direction,
  RoomStyles,
} from '../services/constants';

import PartyGoer from './PartyGoer';

interface RoomProps {
  name: 'red' | 'green' | 'blue' | 'yellow';
  positions: Record<string, Position>;
  setPeers: React.Dispatch<React.SetStateAction<Peers>>;
  setPositions: React.Dispatch<React.SetStateAction<Positions>>;
  socket: SocketIOClient.Socket;
  party: any;
}

const Room: FC<RoomProps> = ({
  name,
  positions,
  setPeers,
  setPositions,
  socket,
  party,
}): ReactElement => {
  const switchRoom = (dir: Dir) => {
    const playerPosition = positions[socket.id];
    const { top, left } = playerPosition;
    const previousRoom = positions[socket.id].currentRoom;
    const newRoom = (dir === 'UP' || dir === 'DOWN') ? house[previousRoom].yChange : house[previousRoom].xChange;

    if (dir === 'UP') {
      playerPosition.top = top + roomSize - 50;
      playerPosition.currentRoom = newRoom;
    } else if (dir === 'DOWN') {
      playerPosition.top = top - roomSize + 50;
      playerPosition.currentRoom = newRoom;
    } else if (dir === 'LEFT') {
      playerPosition.left = left + roomSize - 50;
      playerPosition.currentRoom = newRoom;
    } else if (dir === 'RIGHT') {
      playerPosition.left = left - roomSize + 50;
      playerPosition.currentRoom = newRoom;
    }

    setPositions({ ...positions });
    setPeers({});
    socket.emit('player moved', { [socket.id]: playerPosition });
    socket.emit('switch room', previousRoom, newRoom);
  };

  const handlePlayerMovement = (direction: Direction) => {
    // existing coordinates
    const playerPosition = positions[socket.id];
    const { top, left } = playerPosition;
    const { dir } = direction;

    // boundary movement handled by switchRoom
    if (dir === 'UP' && top <= 0) {
      switchRoom('UP');
    } else if (dir === 'DOWN' && top >= roomSize - 50) {
      switchRoom('DOWN');
    } else if (dir === 'LEFT' && left <= 0) {
      switchRoom('LEFT');
    } else if (dir === 'RIGHT' && left >= roomSize - 50) {
      switchRoom('RIGHT');
    } else {
      // normal field movement
      playerPosition.top = top + 5 * direction.top;
      playerPosition.left = left + 5 * direction.left;
      setPositions({ ...positions });
      socket.emit('player moved', { [socket.id]: playerPosition });
    }
  };

  let roomBackgroundImage: string;
  if (name === 'red') {
    roomBackgroundImage = party.roomOneBackground;
  } else if (name === 'blue') {
    roomBackgroundImage = party.roomTwoBackground;
  } else if (name === 'green') {
    roomBackgroundImage = party.roomThreeBackground;
  } else {
    roomBackgroundImage = party.roomFourBackground;
  }

  const defaultBackground = roomBackgroundImage === undefined
    || roomBackgroundImage === 'red'
    || roomBackgroundImage === 'blue'
    || roomBackgroundImage === 'green'
    || roomBackgroundImage === 'yellow';

  const backgroundStyle: CSSProperties = {
    backgroundImage: `url(${roomBackgroundImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  return (
    <div
      className={`relative w-full h-full inline-block ${defaultBackground ? RoomStyles[name] : ''}`}
      style={defaultBackground ? {} : backgroundStyle}
    >
      <Player
        handlePlayerMovement={handlePlayerMovement}
        position={positions[socket.id]}
      />
      {Object.keys(positions).filter(socketId => {
        return socketId !== socket.id
          && positions[socketId].currentRoom === positions[socket.id].currentRoom;
      }).map((socketId, i) => {
        return (
          <PartyGoer
            calibration={(i + 1) * 50}
            key={socketId}
            position={positions[socketId]}
          />
        );
      })}
    </div>
  );
};

export default Room;
