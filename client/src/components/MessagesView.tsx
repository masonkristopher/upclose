import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
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
  },
  showMessages: any,
  setShowMessages: any,
}

const MessagesView: FC<IProps> = ({ user, clickedUser, showMessages, setShowMessages }) => {
  const [typedMessage, setTypedMessage]: any = useState('');
  const [allMessages, setAllMessages]: any = useState([]);

  const updateMessages = () => {
    axios
      .get(`/messages/all/${user.id}/${clickedUser.id}`)
      .then((response) => {
        console.log('messages between two users', response);
        setAllMessages(response.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    updateMessages();
  }, []);

  const sendMessage = () => {
    const messageObj = {
      message: typedMessage,
      idSender: user.id,
      idRecipient: clickedUser.id,
    };

    axios
      .post('/messages/send', messageObj)
      .then(() => console.log('Message was sent', messageObj))
      .then(() => updateMessages())
      .catch(error => console.log(error));
  };

  return (
    <div>
      <div className="text-blue">
        I am the child of beautiful Messages
      </div>
      <div>
        {allMessages.length >= 1
          ? allMessages.map((messageObj: {id: number, message: string, idSender: number, idRecipient: number}) => (
            <div key={messageObj.id}>
              {messageObj.idSender === user.id
                ? (
                  <div className="">
                    <img
                      className="rounded-full mx-auto h-6 w-6"
                      src={user.avatar}
                      alt="avatar"
                    />
                    <p className="bg-gray-200">{messageObj.message}</p>
                  </div>
                )
                : (
                  <div className="">
                    <img
                      className="rounded-full mx-auto h-6 w-6"
                      src={clickedUser.avatar}
                      alt="avatar"
                    />
                    <p className="bg-blue-200">{messageObj.message}</p>
                  </div>
                )}
            </div>
          ))
          : (
            <div>Say something!</div>
          )}
      </div>
      <div className="">
        <input
          onChange={(e) => setTypedMessage(e.target.value)}
          className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          type="text"
          value={typedMessage}
        />
        <button
          onClick={() => sendMessage()}
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4"
          type="button"
        >
          Send
        </button>
        <button
          onClick={() => setShowMessages(!showMessages)}
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4"
          type="button"
        >
          Back to Threads
        </button>
      </div>
    </div>
  );
};

export default MessagesView;
