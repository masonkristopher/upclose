/* eslint-disable max-len */
import React, { FC, ReactElement } from 'react';

interface RoomProps {
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

const Room: FC<RoomProps> = ({
  // roomNumber,
  changeRoom,
}): ReactElement => {
  return (
    <div className="">
      <div className="bg-gray-200 p-2 min-h-screen">
        <div className="">
          <div className="inline-block w-1/2 bg-red-300 p-4">
            {/* {roomNumber !== 1 && <button type="button" onClick={() => changeRoom(1)}>Join Room 1</button>} */}
            <button type="button" onClick={() => changeRoom(1)}>Join Room 1</button>
          </div>
          <div className="inline-block w-1/2 bg-blue-300 p-4">
            {/* {roomNumber !== 2 && <button type="button" onClick={() => changeRoom(2)}>Join Room 2</button>} */}
            <button type="button" onClick={() => changeRoom(2)}>Join Room 2</button>
          </div>
        </div>
        <div className="inline-block w-1/2 bg-green-300 p-4">
          {/* {roomNumber !== 3 && <button type="button" onClick={() => changeRoom(3)}>Join Room 3</button>} */}
          <button type="button" onClick={() => changeRoom(3)}>Join Room 3</button>
        </div>
        <div className=" inline-block w-1/2 bg-yellow-300 p-4">
          {/* {roomNumber !== 4 && <button type="button" onClick={() => changeRoom(4)}>Join Room 4</button>} */}
          <button type="button" onClick={() => changeRoom(4)}>Join Room 4</button>
        </div>
      </div>
    </div>
  );
};

export default Room;
