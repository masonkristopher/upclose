import React, { FC, ReactElement, useState, MouseEvent, KeyboardEvent, useEffect, useRef } from 'react';
import io from 'socket.io-client';

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
}

const ChatSend: FC<ChatSendProps> = ({ user }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages]: any = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const { current: socket } = useRef(io());

  const randomKey = () => {
    return Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15);
  };

  const sendChat = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();
    setMessageCount(messageCount + 1);
    const messageObj = {
      messageCount,
      message,
      user,
    };
    socket.emit('chat message', messageObj);
    setMessage(''); // clear the input
  };

  const onKeyPress = (event: KeyboardEvent) => {
    if (event.which === 13) sendChat(event);
  };
  
  // @ts-ignore
  useEffect(() => {
    socket.on('sending chat message', (msg: any) => {
      setMessages((msgs: any) => [...msgs, msg]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="text-blue border rounded p-4 bg-gray-200">
      {messages.map((msg: any) => {
        const key = msg.messageCount + msg.user.id + randomKey();
        return (
          <div key={key}>
            <p>
              {`${msg.user.username}: ${msg.message}`}
            </p>
          </div>
        );
      })}
      <br />
      <input id="chat-input" value={message} onKeyPress={onKeyPress} onChange={(e) => setMessage(e.target.value)} type="text" className="appearance-none shadow block w-full bg-gray-100 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
      <br />
      <button onClick={(e) => sendChat(e)} type="button" className="bg-white hover:bg-pink-100 text-gray-800 font-semibold p-1 border border-gray-400 rounded shadow float-right">Send</button>
      <br />
    </div>
  );
};

export default ChatSend;
