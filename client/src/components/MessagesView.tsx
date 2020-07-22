import React, {
  FC, useState, MouseEvent, KeyboardEvent, useEffect,
} from 'react';
import axios from 'axios';
import moment from 'moment';

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

const MessagesView: FC<IProps> = ({
  user, clickedUser, showMessages, setShowMessages,
}) => {
  const [message, setMessage]: any = useState('');
  const [allMessages, setAllMessages]: any = useState([]);

  const getMessages = () => {
    axios
      .get(`/messages/all/${user.id}/${clickedUser.id}`)
      .then((response) => {
        setAllMessages(response.data);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    getMessages();
    const interval = setInterval(() => {
      getMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();
    const messageObj = {
      message,
      idSender: user.id,
      idRecipient: clickedUser.id,
    };
    axios
      .post('/messages/send', messageObj)
      .then(() => {
        getMessages();
        setMessage('');
      })
      .catch(error => console.log(error));
  };

  const onKeyPress = (event: KeyboardEvent) => {
    if (event.which === 13) sendMessage(event);
  };

  return (
    <div>
      <div className="text-blue">
        I am the child of beautiful Messages
        <button
          onClick={() => setShowMessages(!showMessages)}
          type="button"
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4"
        >
          back
        </button>
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
      <div className="flex justify-center bg-gray-200">
        <div>
          <input
            value={message}
            onKeyPress={onKeyPress}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4 "
          />
        </div>
        <div>
          <button
            onClick={(e) => sendMessage(e)}
            type="button"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4"
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
