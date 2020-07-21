import React, { Dispatch, FC, ReactElement, SetStateAction } from 'react';
import { CSSProperties } from 'styled-components';

import Player from './Player';

import {
  Dir,
  Direction,
  House,
  Party,
  Peers,
  Position,
  Positions,
  roomSize,
  RoomStyles,
} from '../services/constants';

import PartyGoer from './PartyGoer';

interface RoomProps {
  currentRoom: string;
  house: House;
  positions: Record<string, Position>;
  setPeers: Dispatch<SetStateAction<Peers>>;
  setPositions: Dispatch<SetStateAction<Positions>>;
  socket: SocketIOClient.Socket;
  party: Party;
}

const Room: FC<RoomProps> = ({
  house,
  currentRoom,
  positions,
  setPeers,
  setPositions,
  socket,
  party,
}): ReactElement => {
  const rooms = Object.keys(house);

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
    socket.emit('player moved', { [socket.id]: playerPosition }, rooms);
    socket.emit('switch room', previousRoom, newRoom, rooms);
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
      playerPosition.top = top + 10 * direction.top;
      playerPosition.left = left + 10 * direction.left;
      setPositions({ ...positions });
      socket.emit('player moved', { [socket.id]: playerPosition }, rooms);
    }
  };

  let roomBackgroundImage: string | undefined;
  if (currentRoom === party.idRoomOne) {
    roomBackgroundImage = party.roomOneBackground;
  } else if (currentRoom === party.idRoomTwo) {
    roomBackgroundImage = party.roomTwoBackground;
  } else if (currentRoom === party.idRoomThree) {
    roomBackgroundImage = party.roomThreeBackground;
  } else {
    roomBackgroundImage = party.roomFourBackground;
  }

  const defaultBackground = roomBackgroundImage === undefined
    || roomBackgroundImage === 'red'
    || roomBackgroundImage === 'blue'
    || roomBackgroundImage === 'brown'
    || roomBackgroundImage === 'white'
    || roomBackgroundImage === 'pink'
    || roomBackgroundImage === 'black'
    || roomBackgroundImage === 'purple'
    || roomBackgroundImage === 'green'
    || roomBackgroundImage === 'orange'
    || roomBackgroundImage === 'yellow';

  const backgroundStyle: CSSProperties = {
    backgroundImage: `url(${roomBackgroundImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  return (
    <div
    // to do: fix this Roomstyles typescript problem
    // @ts-ignore
      className={`relative w-500 h-500 inline-block ${defaultBackground ? (RoomStyles as any)[roomBackgroundImage] : ''}`}
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
