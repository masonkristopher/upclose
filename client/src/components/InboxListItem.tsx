import React, { FC, ReactElement, useState, useEffect } from 'react';
import UserDetails from './UserDetails';

interface InboxListItemProps {
  // user: {
  //   id: number,
  //   nameFirst: string,
  //   nameLast: string,
  //   username: string,
  //   email: string,
  //   avatar: string,
  //   googleId: string,
  // },
  thread: {
    someStuff: number

  }
}

const Template: FC<InboxListItemProps> = ({
  // user,
  thread,
}): ReactElement => {
  return (
    <div className="">
      {thread.someStuff}
    </div>
  );
};

export default Template;
