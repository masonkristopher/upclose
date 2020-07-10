/* eslint-disable max-len */
import React, { FC, ReactElement } from 'react';

interface position {
  top: number,
  left: number,
}

interface PartyGoerProps {
  position: position;
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

const PartyGoer: FC<PartyGoerProps> = ({
  user,
  position,
}): ReactElement => {
  const assignPosition = (position: position) => {
    return {
      top: `${position.top}px`,
      left: `${position.left}px`,
    };
  };

  return (
    <div className="">
      <img
        className="relative rounded-full h-10 w-10 z-10"
        style={assignPosition(position)}
        src={user.avatar}
        alt="party goer"
      />
    </div>
  );
};

export default PartyGoer;
