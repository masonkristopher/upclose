import React, { FC, ReactElement } from 'react';

import Controls from './Controls';
import Radar from './Radar';

import { Positions } from '../services/constants';

interface PlayerVideoPanelProps {
  positions: Positions;
  socket: SocketIOClient.Socket,
  userVideo: React.RefObject<HTMLVideoElement>,
}

const PlayerVideoPanel: FC<PlayerVideoPanelProps> = ({
  positions,
  socket,
  userVideo,
}): ReactElement => {
  return (
    <div className="">
      {/* Your Video */}
      <div className="z-10">
        <video muted autoPlay ref={userVideo} className="mb-3 shadow-md z-0" />
      </div>

      {/* AV Controls */}
      <Controls userVideo={userVideo} />

      {/* Radar */}
      <div className="float-right">
        <Radar positions={positions} socket={socket} />
      </div>
    </div>
  );
};

export default PlayerVideoPanel;
