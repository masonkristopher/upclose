/* eslint-disable max-len */
import React, { FC, ReactElement } from 'react';

import { Position } from '../services/constants';

interface PartyGoerProps {
  calibration?: number;
  position: Position;
}

const PartyGoer: FC<PartyGoerProps> = ({
  calibration = 0,
  position,
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
        className="relative rounded-full h-50p w-50p z-10"
        style={assignPosition(position)}
        src={position.avatar}
        alt="party goer"
      />
    </div>
  );
};

export default PartyGoer;
