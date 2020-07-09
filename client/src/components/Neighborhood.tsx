import React, { FC } from 'react';

import HouseParty from './HouseParty';

interface NeighborhoodProps {
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  }
}

const Neighborhood: FC<NeighborhoodProps> = () => {
  return (
    <div className="text-blue">
      <h1 className="">Welcome to Your Neighborhood!</h1>
      <HouseParty partyName="testParty" />
    </div>
  );
};

export default Neighborhood;
