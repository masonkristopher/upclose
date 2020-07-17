/* eslint-disable max-len */
import React, { FC, ReactElement } from 'react';

import Room from './Room';

import { User, Position } from '../services/constants';

interface HouseProps {
  positions: Record<string, Position>;
  setPeers: any;
  setPositions: any;
  socket: SocketIOClient.Socket;
  user: User;
  party: any;
}

const House: FC<HouseProps> = ({
  positions,
  setPeers,
  setPositions,
  socket,
  user,
  party,
}): ReactElement => {
  return (
    <div className="">
      <div className="">
        {`${user.username} is in Room: ${positions[socket.id].currentRoom}`}
      </div>
      <div className="mx-auto bg-gray-200 h-500 w-500 border-solid border-black" id="house-container">
        <Room
          name={positions[socket.id].currentRoom}
          positions={positions}
          setPeers={setPeers}
          setPositions={setPositions}
          socket={socket}
          party={party}
        />
      </div>
    </div>
  );
};

export default House;
