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
  // roomID: any;
}

const House: FC<HouseProps> = ({
  user,
  setRoomID,
  // roomID,
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

  // const [users, setUsers] = useState([]);

  const [currRoom, setCurrRoom] = useState(rooms.red);

  const changeRoom = (dir: dir) => {
    if (dir === 'UP' || dir === 'DOWN') {
      const { yChange } = currRoom;
      setCurrRoom(rooms[yChange]);
      setRoomID(yChange);
    } else if (dir === 'LEFT' || dir === 'RIGHT') {
      const { xChange } = currRoom;
      setCurrRoom(rooms[xChange]);
      setRoomID(xChange);
    }
  };

  return (
    <div className="">
      <div className="">
        {`${user.username} is in Room: ${currRoom.name}`}
      </div>
      <div className="mx-auto bg-gray-200 h-500 w-500 border-solid border-black" id="house-container">
        <Room name="Room 1" layout={currRoom.name} user={user} changeRoom={changeRoom} />
        {/* <Room name="2" layout="blue" user={user} changeRoom={changeRoom} />
        <Room name="3" layout="green" user={user} changeRoom={changeRoom} />
        <Room name="4" layout="yellow" user={user} changeRoom={changeRoom} /> */}
      </div>
    </div>
  );
};

export default House;
