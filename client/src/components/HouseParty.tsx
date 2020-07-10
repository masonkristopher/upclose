import React, { FC, ReactElement, useState, useEffect, useRef } from 'react';

import House from './House';
import VideoList from './VideoList';
import ChatFeed from './ChatFeed';
import ChatSend from './ChatSend';

interface HousePartyProps {
  partyName: string;
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

const HouseParty: FC<HousePartyProps> = ({
  partyName,
  user,
}): ReactElement => {
  const [roomNumber, setRoomNumber] = useState(1);

  const changeRoom = (room: number) => {
    setRoomNumber(room);
  };

  const house = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (house.current !== null) {
      console.log(house.current.getBoundingClientRect());
    }
  });

  return (
    <div className="container">
      {/* Header */}
      <div className="">
        {`Party Name: ${partyName} You are in Room: ${roomNumber}`}
      </div>
      <div className="">
        {`You are in Room: ${roomNumber}`}
      </div>

      {/* House */}
      <div className="container mx-auto px-4">
        <div className="" ref={house}>
          <House roomNumber={roomNumber} changeRoom={changeRoom} user={user} />
        </div>
        <div className="bg-gray-500">
          {/* Your Video */}
          <div>
            <VideoList />
          </div>
          {/* Other Videos */}
          <div>
            <VideoList />
          </div>
        </div>
      </div>

      {/* Right=Side Video Side Panel */}
      {/* Underneath Chat Feature */}
      <div className="container">
        <ChatFeed />
        <ChatSend />
      </div>
    </div>
  );
};

export default HouseParty;
