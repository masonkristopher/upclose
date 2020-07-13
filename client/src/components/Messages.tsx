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
  // get rid of hard coded clickedUser
  const [clickedUser, setClickedUser]: any = useState({
    id: 2,
    nameFirst: 'Travis',
    nameLast: 'Scott',
    username: 'AstroJack',
    email: 'JackBoys@gmail.com',
    avatar: 'https://i1.sndcdn.com/avatars-000701366305-hu9f0i-t500x500.jpg',
    googleId: 'google ID here',
  });
  const [messageView, setMessageView] = useState(false);
  // const [] = useState();

  return (
    <div>
      {/* <div>
        {messageView
          ? <MessagesView clickedUser={clickedUser} user={user} />
          : (
            <div className="text-blue">
              I am the beautiful Messages
            </div>
          )}
      </div> */}
      <MessagesView clickedUser={clickedUser} user={user} />
    </div>
  );
};

export default Messages;
