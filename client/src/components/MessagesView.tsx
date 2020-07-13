import React, { FC, useState } from 'react';
// maybe I am a popup, maybe a dropdown menu thing, maybe a separate page
interface IProps {
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  },
  clickedUser: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  }
}

const fakeMessages = [
  {
    id: 1,
    message: "What's up gamer",
    sender_id: 3,
    recipient_id: 2,
  },
  {
    id: 2,
    message: 'Nothing much',
    sender_id: 2,
    recipient_id: 3,
  },
  {
    id: 3,
    message: "What's up gamer",
    sender_id: 3,
    recipient_id: 2,
  },
  {
    id: 4,
    message: "What's up gamer",
    sender_id: 3,
    recipient_id: 2,
  },
  {
    id: 4,
    message: 'EZ Dubs',
    sender_id: 2,
    recipient_id: 3,
  },
];

const MessagesView: FC<IProps> = ({ user, clickedUser }) => {
  const [message, setMessage]: any = useState('');
  const [allMessages, setAllMessages]: any = useState(fakeMessages);

  return (
    <div>
      <div className="text-blue">
        I am the child of beautiful Messages
      </div>
      <div>
        {/* make this not equal to fake messages once backend is set up. */}
        {allMessages === fakeMessages
          ? allMessages.map((messageObj: any) => (
            messageObj.sender_id === user.id
              ? (
                <div key={messageObj.id}>
                  <img
                    className="rounded-full mx-auto h-6 w-6"
                    src={user.avatar}
                    alt="avatar"
                  />
                  <li>{{ message }}</li>
                </div>
              )
              : (
                <div key={messageObj.id}>
                  <img
                    className="rounded-full mx-auto h-6 w-6"
                    src={clickedUser.avatar}
                    alt="avatar"
                  />
                  <li>{{ message }}</li>
                </div>
              )
          ))
          : (
            <div>Say something!</div>
          )}
      </div>
      <div>
        <form>
          <input type="text" name="name" placeholder="Enter a message" />
          <input type="submit" value="Submit" />
          <button type="button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default MessagesView;
