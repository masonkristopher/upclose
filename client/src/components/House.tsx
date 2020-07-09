/* eslint-disable max-len */
import React, { FC, ReactElement } from 'react';

interface HouseProps {
  roomNumber: number;
  changeRoom: (room: number) => void;
}

const House: FC<HouseProps> = ({
  // roomNumber,
  changeRoom,
}): ReactElement => {
  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="inline-block bg-red-400">
            {/* {roomNumber !== 1 && <button type="button" onClick={() => changeRoom(1)}>Join Room 1</button>} */}
            <button type="button" onClick={() => changeRoom(1)}>Join Room 1</button>
          </div>
          <div className="inline-block bg-blue-400">
            {/* {roomNumber !== 2 && <button type="button" onClick={() => changeRoom(2)}>Join Room 2</button>} */}
            <button type="button" onClick={() => changeRoom(2)}>Join Room 2</button>
          </div>
        </div>
        <div className="inline-block bg-green-400">
          {/* {roomNumber !== 3 && <button type="button" onClick={() => changeRoom(3)}>Join Room 3</button>} */}
          <button type="button" onClick={() => changeRoom(3)}>Join Room 3</button>
        </div>
        <div className=" inline-block bg-yellow-400">
          {/* {roomNumber !== 4 && <button type="button" onClick={() => changeRoom(4)}>Join Room 4</button>} */}
          <button type="button" onClick={() => changeRoom(4)}>Join Room 4</button>
        </div>
      </div>
    </div>
  );
};

export default House;
