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
  },
  setClickedUser: any,
}

const InboxListItem: FC<InboxListItemProps> = ({
  // user,
  thread,
  setClickedUser,
}): ReactElement => {
  return (
    <div className="">
      <img
        className="relative rounded-full h-10 w-10 z-10"
        src={thread.avatar}
        alt=""
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-1 px-2 rounded" type="button" onClick={() => { setClickedUser(thread); }}>{ thread.username }</button>
      {/* <ul onClick={onCLick}>
        {thread.username}
      </ul> */}
    </div>
  );
};

export default InboxListItem;
