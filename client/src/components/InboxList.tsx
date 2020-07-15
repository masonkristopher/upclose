import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import MessagesView from './MessagesView';
import InboxListItem from './InboxListItem';
import { any } from 'bluebird';

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
  },
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
  const [threads, setThreads]: any = useState([]);

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
        });
        // return userArr;
      });
  }, []);

  return (
    <div>
      {threads.map((thread: any) => {
        return (
          <InboxListItem
            thread={thread}
            key={thread.id}
            setClickedUser={setClickedUser}
          />
        );
      })}
      {/* <MessagesView clickedUser={clickedUser} user={user} /> */}
    </div>
  );
};

export default Messages;
