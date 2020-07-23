import React, {
  FC, useState, useRef, MouseEvent, KeyboardEvent, useEffect,
} from 'react';
import ReactDOM from 'react-dom';
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

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (elementRef.current !== null) elementRef.current.scrollIntoView({ behavior: 'smooth' });
  });
  return <div ref={elementRef} />;
};

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
      <div>
        {/* <svg
          className="w-20 h-20 pt-2 fill-current text-seaweed"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path xmlns="http://www.w3.org/2000/svg" d="M24 1h-24v16.981h4v5.019l7-5.019h13z"/>
        </svg> */}
      </div>
      <div className="flex justify-center mb-6">
        <div>
          <button
            onClick={() => setShowMessages(!showMessages)}
            type="button"
            className="float-left bg-white hover:bg-pink-100 text-gray-800 font-semibold p-2 mx-2 border border-gray-400 rounded-full shadow"
          >
            <svg className="h-6 w-6 pt-1 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg">
              <polygon className="heroicon-ui" points="3.828 9 9.899 2.929 8.485 1.515 0 10 .707 10.707 8.485 18.485 9.899 17.071 3.828 11 20 11 20 9 3.828 9" />
            </svg>
          </button>
          <img
            className="rounded-full h-16 w-16 ml-2 object-center"
            src={clickedUser.avatar}
            alt="avatar"
          />
          <p className="text-center">{clickedUser.username}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-300 h-400 overflow-y-auto">
          {allMessages.length >= 1
            ? allMessages.map((messageObj: {id: number, message: string, idSender: number, idRecipient: number, createdAt: string}) => (
              <div key={messageObj.id}>
                {messageObj.idSender === user.id
                  ? (
                    <div className="flex justify-end m-2">
                      <div>
                        {/* <img
                          className="rounded-full h-6 w-6 float-left mr-2"
                          src={user.avatar}
                          alt="avatar"
                        /> */}
                        <p className="w-auto bg-avocado px-3 py-2 rounded-lg float-none">{messageObj.message}</p>
                        <p className="text-right text-xs text-grey-dark mt-1">{moment(messageObj.createdAt).fromNow()}</p>
                      </div>
                    </div>
                  )
                  : (
                    <div className="m-2 w-auto inline-block">
                      {/* <img
                        className="rounded-full h-6 w-6 float-right ml-2"
                        src={clickedUser.avatar}
                        alt="avatar"
                      /> */}
                      <p className="w-auto bg-gray-300 px-3 py-2 rounded-lg">{messageObj.message}</p>
                      <p className="text-xs text-grey-dark mt-1">{moment(messageObj.createdAt).fromNow()}</p>
                    </div>
                  )}
              </div>
            ))
            : (
              <div>Say something!</div>
            )}

          {/* dummy div for useRef to scroll to bottom of chat */}
          <AlwaysScrollToBottom />
        </div>

      </div>
      <div className="flex justify-center">
        <div>
          <input
            value={message}
            onKeyPress={onKeyPress}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="appearance-none shadow float-left w-chat-input bg-gray-100 text-gray-700 border border-gray-400 rounded py-3 px-4 mt-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        <div>
          <button
            onClick={(e) => sendMessage(e)}
            type="button"
            className="float-left bg-white hover:bg-pink-100 text-gray-800 font-semibold p-2 mx-2 mt-4 border border-gray-400 rounded-full shadow"
          >
            <svg className="h-6 w-6 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg">
              <path xmlns="http://www.w3.org/2000/svg" className="heroicon-ui" d="M13 5.41V21a1 1 0 0 1-2 0V5.41l-5.3 5.3a1 1 0 1 1-1.4-1.42l7-7a1 1 0 0 1 1.4 0l7 7a1 1 0 1 1-1.4 1.42L13 5.4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;

