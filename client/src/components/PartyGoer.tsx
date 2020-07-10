/* eslint-disable max-len */
import React, { FC, ReactElement, useState } from 'react';

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
  // const [currPosition, setCurrPosition] = useState(position);

  const assignPosition = (position: position) => {
    return {
      top: `${position.top}px`,
      left: `${position.left}px`,
    };
  };

  return (
    <div className="">
      <img
        className="absolute rounded-full h-10 w-10 z-10"
        style={assignPosition(position)}
        src={user.avatar}
        alt="party goer"
      />
    </div>
  );
};

export default PartyGoer;
