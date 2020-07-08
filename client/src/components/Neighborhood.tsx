import React, { FC } from 'react';
// our landing page
interface IProps {
  user:{
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  }
}

const Neighborhood: FC<IProps> = () => {
  return (
    <div className="text-blue">
      I am the beautiful Neighborhood
    </div>
  );
};

export default Neighborhood;
