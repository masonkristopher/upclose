import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import MessagesView from './MessagesView';
import InboxListItem from './InboxListItem';
import SearchMessage from './SearchMessage';

interface IProps {
  user:{
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  },
}

const Messages: FC<IProps> = ({ user }) => {
  const [clickedUser, setClickedUser]: any = useState({});
  const [threads, setThreads]: any = useState([]);
  const [showMessages, setShowMessages]: any = useState(clickedUser !== {});
  const [recentMessages, setRecentMessages]: any = useState([]);
  const [searching, setSearching]: any = useState(false);

  useEffect(() => {
    axios
      .get(`messages/threads/${user.id}`)
      .then(response => {
        console.log(response);
        response.data.forEach((id: number) => {
          axios
            .get(`user/${id}`)
            .then(resObj => {
              setThreads((users: any) => [...users, resObj.data]);
            });
          axios
            .get(`messages/${user.id}/${id}/last`)
            .then(res => {
              console.log('line40', res.data);
              recentMessages.push(res.data);
            })
            .catch(error => console.error(error));
          
        });
      });
  }, []);

  // use this use effect if when know what the other id is or handle the request in the upper useEffect
  // useEffect(() => {
  //   axios
  //     .get(`messages/${user.id}/${thread.id}/last`)
  //     .then(response => setRecentMessage(response.data))
  //     .catch(error => console.error(error));
  // }, []);

  const handleMessageView = (thread: any) => {
    setClickedUser(thread);
    setShowMessages(!showMessages);
  };

  return (
    <div className="bg-seaweed">
      {!showMessages
        ? (<div><MessagesView clickedUser={clickedUser} user={user} showMessages={showMessages} setShowMessages={setShowMessages} /></div>)
        : (
          <div className="">
            <div className="flex justify-evenly">
              <h1 className="text-avocado font-bold text-xl mb-2">Messages</h1>
              <div className="text-right">
                <button
                  className="bg-avocado hover:text-white text-seaweed font-bold my-1 py-1 px-2 rounded"
                  type="button"
                  onClick={() => { setSearching(!searching); }}
                >
                  New
                </button>
              </div>
            </div>
            {searching
              ? (
                <div className="text-middle">
                  <SearchMessage setClickedUser={setClickedUser} showMessages={showMessages} setShowMessages={setShowMessages} />
                </div>
              )
              : null}
            <div className="flex justify-around">
              {threads.map((thread: any) => {
                return (
                  <InboxListItem
                    thread={thread}
                    key={thread.id}
                    handleMessageView={handleMessageView}
                    recentMessages={recentMessages}
                  />
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
};

export default Messages;
