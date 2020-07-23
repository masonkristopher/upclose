import React, { FC, ReactElement } from 'react';

import Controls from './Controls';
import Radar from './Radar';

import { Party, Positions, User } from '../services/constants';
import ChatSend from './ChatSend';

interface PlayerVideoPanelProps {
  party: Party;
  positions: Positions;
  socket: SocketIOClient.Socket;
  user: User;
  userVideo: React.RefObject<HTMLVideoElement>;
}

const PlayerVideoPanel: FC<PlayerVideoPanelProps> = ({
  party,
  positions,
  socket,
  user,
  userVideo,
}): ReactElement => {
  return (
    <div className="">
      {/* Your Video */}
      <div className="z-10">
        <video muted autoPlay ref={userVideo} className="mb-3 shadow-md z-0 rounded" />
      </div>

      {/* AV Controls */}
      <Controls userVideo={userVideo} />

      {/* Radar */}
      <div className="float-right inline-block">
        <Radar party={party} positions={positions} socket={socket} />
      </div>
      <div className="clear-both py-3">
        <ChatSend key={user.id} user={user} socket={socket} />
      </div>
    </div>
  );
};

export default PlayerVideoPanel;
