import React, { FC, useState } from 'react';
import MessagesView from './MessagesView';

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

const Messages: FC<IProps> = ({ user }) => {
  const [clickedUser, setClickedUser]: any = useState({});
  const [messageView, setMessageView] = useState(false);
  // const [] = useState();

  return (
    <div>
      <div>
        {messageView
          ? <MessagesView clickedUser={clickedUser} user={user} />
          : (
            <div className="text-blue">
              I am the beautiful Messages
            </div>
          )}
      </div>
    </div>
  );
};

export default Messages;
