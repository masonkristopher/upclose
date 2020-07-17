import React, { FC, ReactElement, useState, useEffect } from 'react';

interface RadarProps {
  positions: Record<string, Position>;
}

const Radar: FC<RadarProps> = ({
  positions,
}): ReactElement => {
  const containerStyle = {
  };

  return (
    <div className="" >
      This is the radar
    </div>
  );
};

export default Radar;
