import React, { FC, ReactElement, useState, useEffect } from 'react';
import UserDetails from './UserDetails';

interface InboxListItemProps {
  // // user: {
  //   id: number,
  //   nameFirst: string,
  //   nameLast: string,
  //   username: string,
  //   email: string,
  //   avatar: string,
  //   googleId: string,
  // // },
  thread: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  }
}

const InboxListItem: FC<InboxListItemProps> = ({
  // user,
  thread,
}): ReactElement => {
  return (
    <div className="">
      <img
        className="relative rounded-full h-10 w-10 z-10"
        src={thread.avatar}
        alt=""
      />
      <ul>
        {thread.username}
      </ul>
    </div>
  );
};

export default InboxListItem;
