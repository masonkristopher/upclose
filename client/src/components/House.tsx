/* eslint-disable max-len */
import React, { FC, ReactElement, useState, useEffect, useRef } from 'react';
import PartyGoer from './PartyGoer';
import Player from './Player';
import Room from './Room';

// type layout = 'red' | 'green' | 'blue' | 'yellow';
type dir = 'LEFT' | 'UP' | 'RIGHT' | 'DOWN';
type layout = 'red' | 'green' | 'blue' | 'yellow';

interface iRoom {
  name: layout,
  xChange: layout,
  yChange: layout,
}

interface iHouse {
  red: iRoom,
  blue: iRoom,
  green: iRoom,
  yellow: iRoom,
}

interface HouseProps {
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  };
  setRoomID: any;
}

const House: FC<HouseProps> = ({
  user,
  setRoomID,
}): ReactElement => {
  const [rooms, setRooms] = useState<iHouse>({
    red: {
      name: 'red',
      xChange: 'blue',
      yChange: 'green',
    },
    blue: {
      name: 'blue',
      xChange: 'red',
      yChange: 'yellow',
    },
    green: {
      name: 'green',
      xChange: 'yellow',
      yChange: 'red',
    },
    yellow: {
      name: 'yellow',
      xChange: 'green',
      yChange: 'blue',
    },
  });

  const [currRoom, setCurrRoom] = useState(rooms.red);

  const changeRoom = (dir: dir) => {
    const { name, xChange, yChange } = currRoom;
    if (dir === 'UP' || dir === 'DOWN') {
      setCurrRoom(rooms[yChange]);
      setRoomID({ oldRoom: name, newRoom: yChange });
    } else if (dir === 'LEFT' || dir === 'RIGHT') {
      setCurrRoom(rooms[xChange]);
      setRoomID({ oldRoom: name, newRoom: xChange });
    }
  };

  return (
    <div className="">
      <div className="">
        {`${user.username} is in Room: ${currRoom.name}`}
      </div>
      <div className="mx-auto bg-gray-200 h-500 w-500 border-solid border-black" id="house-container">
        <Room name="Room 1" layout={currRoom.name} user={user} changeRoom={changeRoom} playerPosition={playerPosition} setPlayerPosition={setPlayerPosition} />
      </div>
    </div>
  );
};

export default House;
