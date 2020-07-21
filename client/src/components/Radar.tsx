import React, { FC, ReactElement } from 'react';
import { CSSProperties } from 'styled-components';

import RadarDot from './RadarDot';

import { Party, Positions, RoomStyles } from '../services/constants';

interface RadarProps {
  party: Party;
  positions: Positions;
  socket: SocketIOClient.Socket;
}

const Radar: FC<RadarProps> = ({
  party,
  positions,
  socket,
}): ReactElement => {
  const {
    idRoomOne, idRoomTwo, idRoomThree, idRoomFour,
    roomOneBackground, roomTwoBackground, roomThreeBackground, roomFourBackground,
  } = party;

  const rooms = [idRoomOne, idRoomTwo, idRoomThree, idRoomFour];
  const backgrounds = [
    roomOneBackground, roomTwoBackground, roomThreeBackground, roomFourBackground,
  ];

  const containerStyle: CSSProperties = {
    height: '100px',
    width: '100px',
    lineHeight: 0,
  };

  const defaultRoomStyle: CSSProperties = {
    height: '50px',
    width: '50px',
  };

  const createRoomStyle = (roomNumber: number): CSSProperties => {
    return {
      height: '50px',
      width: '50px',
      backgroundImage: `url(${backgrounds[roomNumber]})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    };
  };

  return (
    <div className="relative" style={containerStyle}>
      {rooms.map((room, i) => {
        return (backgrounds[i] === 'red'
          || backgrounds[i] === 'blue'
          || backgrounds[i] === 'green'
          || backgrounds[i] === 'yellow')
          ? (
            <div
              key={room}
              className={`inline-block ${RoomStyles[(backgrounds[i] as 'red' | 'blue' | 'green' | 'yellow')]}`}
              style={defaultRoomStyle}
            />
          )
          : <div key={room} className="inline-block" style={createRoomStyle(i)} />;
      })}
      {Object.keys(positions).map((socketId, i) => {
        if (socketId === socket.id) {
          return (
            <RadarDot
              key={socketId}
              calibration={100 + i * 3}
              color="red"
              position={positions[socketId]}
              rooms={rooms}
            />
          );
        }
        return (
          <RadarDot
            key={socketId}
            calibration={100 + i * 3}
            color="black"
            position={positions[socketId]}
            rooms={rooms}
          />
        );
      })}
    </div>
  );
};

export default Radar;
