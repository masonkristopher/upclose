import React, { FC, useState, MouseEvent, KeyboardEvent, useEffect } from 'react';
import moment from 'moment';

interface ChatSendProps {
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  };
  socket: any;
}

const ChatSend: FC<ChatSendProps> = ({ user, socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages]: any = useState([]);
  const [messageCount, setMessageCount] = useState(0);

  const sendChat = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();
    setMessageCount(messageCount + 1);
    const messageObj = {
      messageCount,
      socketId: socket.id,
      message,
      user,
      timestamp: new Date(),
    };
    setMessages((msgs: any) => [...msgs, messageObj]);
    socket.emit('chat message', messageObj);
    setMessage(''); // clear the input
  };

  const onKeyPress = (event: KeyboardEvent) => {
    if (event.which === 13) sendChat(event);
  };

  useEffect(() => {
    socket.on('sending chat message', (msg: any) => {
      setMessages((msgs: any) => [...msgs, msg]);
    });
  }, []);

  return (
    <div className="relative p-6 border rounded bg-gray-200 h-chat w-500">
      <div className="overflow-y-auto h-40">
        {messages.reverse().map((msg: any) => {
          const key = `${msg.messageCount}-${msg.socketId}`;
          return (
            <div key={key} className="relative">
              {/* <img src={msg.user.avatar} alt={`Avatar for ${msg.user.username}`} className="float-left rounded-full h-5 w-5 z-10 mr-2 mt-1" /> */}
              <span className="align-middle text-xs font-bold">
                {msg.user.username.toUpperCase()}
                :&nbsp;
              </span>
              <span className="align-middle text-sm">
                {msg.message}
              </span>
              <div className="static bottom-0 left-0 clear-both">
                <p className="text-xs text-gray-600 float-right italic">{moment(msg.timestamp).fromNow()}</p>
              </div>
              <div className="clear-both border-t border-gray-300 py-2" />
            </div>
          );
        })}
      </div>
      <br />
      <div className="absolute bottom-0 py-2 w-full">
        <input id="chat-input" value={message} onKeyPress={onKeyPress} onChange={(e) => setMessage(e.target.value)} type="text" className="appearance-none shadow float-left w-chat-input bg-gray-100 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
        <button onClick={(e) => sendChat(e)} type="button" className="float-left bg-white hover:bg-pink-100 text-gray-800 font-semibold p-2 mx-2 border border-gray-400 rounded-full shadow">
          <svg className="h-6 w-6 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg">
            <path xmlns="http://www.w3.org/2000/svg" className="heroicon-ui" d="M13 5.41V21a1 1 0 0 1-2 0V5.41l-5.3 5.3a1 1 0 1 1-1.4-1.42l7-7a1 1 0 0 1 1.4 0l7 7a1 1 0 1 1-1.4 1.42L13 5.4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatSend;
