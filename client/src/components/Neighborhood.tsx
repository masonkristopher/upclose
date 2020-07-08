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
      <h1 className="">Welcome to Your Neighborhood!</h1>
    </div>
  );
};

export default Neighborhood;
