/* eslint-disable max-len */
import React, { FC, ReactElement, useState } from 'react';

import Room from './Room';

import { User, house } from '../services/constants';

interface HouseProps {
  user: User;
  setRoomID: any;
  positions: any;
  setPositions: any;
  socket: any;
}

const House: FC<HouseProps> = ({
  user,
  setRoomID,
  positions,
  setPositions,
  socket,
}): ReactElement => {
  const [currRoom, setCurrRoom] = useState(house.red);

  const changeRoom = (dir: 'LEFT' | 'UP' | 'RIGHT' | 'DOWN') => {
    const { name, xChange, yChange } = currRoom;
    if (dir === 'UP' || dir === 'DOWN') {
      setCurrRoom(house[yChange]);
      setRoomID({ oldRoom: name, newRoom: yChange });
    } else if (dir === 'LEFT' || dir === 'RIGHT') {
      setCurrRoom(house[xChange]);
      setRoomID({ oldRoom: name, newRoom: xChange });
    }
  };

  return (
    <div className="">
      <div className="">
        {`${user.username} is in Room: ${currRoom.name}`}
      </div>
      <div className="mx-auto bg-gray-200 h-500 w-500 border-solid border-black" id="house-container">
        <Room name={currRoom.name} user={user} changeRoom={changeRoom} positions={positions} setPositions={setPositions} socket={socket} />
      </div>
    </div>
  );
};

export default House;
