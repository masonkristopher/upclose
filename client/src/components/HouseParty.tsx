import React, { FC, useState, ReactElement } from 'react';

import House from './House';
import VideoList from './VideoList';
import ChatFeed from './ChatFeed';
import ChatSend from './ChatSend';

interface HousePartyProps {
  partyName: string;
}

const HouseParty: FC<HousePartyProps> = ({
  partyName,
}): ReactElement => {
  const [roomNumber, setRoomNumber] = useState(1);

  const changeRoom = (room: number) => {
    setRoomNumber(room);
  };

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
        <div className="">
          <House roomNumber={roomNumber} changeRoom={changeRoom} />
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
