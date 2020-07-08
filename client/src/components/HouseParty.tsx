import React, { FC, useState, ReactElement, MouseEvent } from 'react';
import VideoList from './VideoList';
import ChatFeed from './ChatFeed';
import ChatSend from './ChatSend';

interface HousePartyProps {
  partyName: string,
}

const HouseParty: FC<HousePartyProps> = ({
  partyName,
}): ReactElement => {
  const [roomNumber, setRoomNumber] = useState();

  const handleClick1 = (event: MouseEvent) => {
    event.preventDefault();
    setRoomNumber(1);
  };

  return (
    <div className="text-blue">
      <h1>
        Party Name:
        {partyName}
        You are in Room:
        {roomNumber}
      </h1>
      <div>
        <button type="submit" onClick={handleClick1}>Join Party 1</button>
        <button type="submit">Join Party 2</button>
        <button type="submit">Join Party 3</button>
        <button type="submit">Join Party 4</button>
      </div>
      <div>
        <VideoList />
      </div>
      <div>
        <ChatFeed />
        <ChatSend />
      </div>
    </div>
  );
};

export default HouseParty;
