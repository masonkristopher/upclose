/* eslint-disable max-len */
import React, { FC, ReactElement } from 'react';

import { Position } from '../services/constants';

interface PartyGoerProps {
  position: Position;
  calibration?: number;
}

const PartyGoer: FC<PartyGoerProps> = ({
  position,
  calibration = 0,
}): ReactElement => {
  const assignPosition = (pos: Position) => {
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
