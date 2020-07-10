/* eslint-disable max-len */
import React, { FC, ReactElement, useState, MutableRefObject } from 'react';
import PartyGoer from './PartyGoer';
import Player from './Player';

interface HouseProps {
  roomNumber: number;
  changeRoom: (room: number) => void;
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

interface direction {
  top: 0 | 1,
  left: 0 | 1,
  dir: 'LEFT' | 'UP' | 'RIGHT' | 'DOWN',
}

const House: FC<HouseProps> = ({
  // roomNumber,
  changeRoom,
  user,
}): ReactElement => {
  const [playerPosition, setPlayerPosition] = useState({ top: 0, left: 0 });

  const handlePlayerMovement = (direction: direction) => {
    const { top, left } = playerPosition;

    // // eslint-disable-next-line default-case
    // switch (direction.dir) {
    //   case 'UP':
    //     if (top === 0) return;
    //     break;
    //   case 'DOWN':
    //     if (top >= maxDim - player) return;
    //     break;
    //   case 'LEFT':
    //     if (left === 0) return;
    //     break;
    //   case 'RIGHT':
    //     if (left >= maxDim - player) return;
    //     break;
    setPlayerPosition({
      top: top + 5 * direction.top,
      left: left + 5 * direction.left,
    });
  };

  return (
    <div className="">
      <Player user={user} position={playerPosition} handlePlayerMovement={handlePlayerMovement} />
      <div className="bg-gray-200 p-2 h-screen" id="house-container">
        <div className="h-half ">
          <div className="inline-block w-1/2 h-full bg-red-300 p-4">
            {/* {roomNumber !== 1 && <button type="button" onClick={() => changeRoom(1)}>Join Room 1</button>} */}
            <button type="button" onClick={() => changeRoom(1)}>Join Room 1</button>
          </div>
          <div className="inline-block w-1/2 h-full bg-blue-300 p-4">
            {/* {roomNumber !== 2 && <button type="button" onClick={() => changeRoom(2)}>Join Room 2</button>} */}
            <button type="button" onClick={() => changeRoom(2)}>Join Room 2</button>
          </div>
        </div>
        <div className="h-half">
          <div className="inline-block w-1/2 h-full bg-green-300 p-4">
            {/* {roomNumber !== 3 && <button type="button" onClick={() => changeRoom(3)}>Join Room 3</button>} */}
            <button type="button" onClick={() => changeRoom(3)}>Join Room 3</button>
          </div>
          <div className=" inline-block w-1/2 h-full bg-yellow-300 p-4">
            {/* {roomNumber !== 4 && <button type="button" onClick={() => changeRoom(4)}>Join Room 4</button>} */}
            <button type="button" onClick={() => changeRoom(4)}>Join Room 4</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default House;
