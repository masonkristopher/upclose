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
  const [recentMessages, setRecentMessages]: any = useState({});
  const [searching, setSearching]: any = useState(false);

  useEffect(() => {
    axios
      .get(`messages/threads/${user.id}`)
      .then(response => {
        // console.log(response);
        response.data.forEach((id: number) => {
          axios
            .get(`user/${id}`)
            .then(resObj => {
              setThreads((users: any) => [...users, resObj.data]);
            });
          axios
            .get(`messages/${user.id}/${id}/last`)
            .then(res => {
              recentMessages[id] = res.data;
              setRecentMessages({ ...recentMessages });
              console.log(recentMessages);
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
    <div className="p-10">
      {!showMessages ? (
        <div>
          <MessagesView
            clickedUser={clickedUser}
            user={user}
            showMessages={showMessages}
            setShowMessages={setShowMessages}
          />
        </div>
      ) : (
        <div className="clickDIV">
          <div className="flex justify-evenly mb-6 pt-8">
            <button
              className="bg-avocado hover:text-white text-seaweed font-bold my-1 py-1 px-2 rounded"
              type="button"
              onClick={() => {
                setSearching(!searching);
              }}
            >
              Start New Thread
            </button>
          </div>
          {searching ? (
            <div className="pt-6">
              <SearchMessage
                setClickedUser={setClickedUser}
                showMessages={showMessages}
                setShowMessages={setShowMessages}
              />
            </div>
          ) : null}
          <div className="flex justify-around pt-8">
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
