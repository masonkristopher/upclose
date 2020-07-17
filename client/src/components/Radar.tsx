import React, { FC, ReactElement } from 'react';
import { CSSProperties } from 'styled-components';

import RadarDot from './RadarDot';

import { Position } from '../services/constants';

interface RadarProps {
  positions: Record<string, Position>;
  socket: SocketIOClient.Socket;
}

const Radar: FC<RadarProps> = ({
  positions,
  socket,
}): ReactElement => {
  const containerStyle: CSSProperties = {
    height: '100px',
    width: '100px',
    lineHeight: 0,
  };

  const roomStyle: CSSProperties = {
    height: '50px',
    width: '50px',
  };

  return (
    <div className="relative block" style={containerStyle}>
      <div className="inline-block bg-red-300" style={roomStyle} />
      <div className="inline-block bg-blue-300" style={roomStyle} />
      <div className="inline-block bg-green-300" style={roomStyle} />
      <div className="inline-block bg-yellow-300" style={roomStyle} />
      {Object.keys(positions).map((socketId, i) => {
        if (socketId === socket.id) {
          return (
            <RadarDot
              key={socketId}
              calibration={100 + i * 3}
              color="red"
              position={positions[socketId]}
            />
          );
        }
        return (
          <RadarDot
            key={socketId}
            calibration={100 + i * 3}
            color="black"
            position={positions[socketId]}
          />
        );
      })}
    </div>
  );
};

export default Radar;
