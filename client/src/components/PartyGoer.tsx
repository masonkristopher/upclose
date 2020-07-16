/* eslint-disable max-len */
import React, { FC, ReactElement } from 'react';

import { User } from '../services/constants';

interface position {
  avatar: string,
  top: number,
  left: number,
}
interface PartyGoerProps {
  position: position;
  calibration?: number;
  // user: User;
}

const PartyGoer: FC<PartyGoerProps> = ({
  // user,
  position,
  calibration = 0,
}): ReactElement => {
  const assignPosition = (pos: position) => {
    return {
      top: `${pos.top - calibration}px`,
      left: `${pos.left}px`,
    };
  };
  return (
    <div className="">
      <img
        className="relative rounded-full h-10 w-10 z-10"
        style={assignPosition(position)}
        src={position.avatar}
        alt="party goer"
      />
    </div>
  );
};

export default PartyGoer;
