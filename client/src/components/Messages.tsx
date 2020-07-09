import React, { FC } from 'react';
// maybe I am a popup, maybe a dropdown menu thing, maybe a separate page
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

const Messages: FC<IProps> = () => {
  return (
    <div className="text-blue">
      I am the beautiful Messages
    </div>
  );
};

export default Messages;
