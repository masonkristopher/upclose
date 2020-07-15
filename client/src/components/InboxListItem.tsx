import React, { FC, ReactElement } from 'react';

interface InboxListItemProps {
  thread: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  },
  handleMessageView: any,
}

const InboxListItem: FC<InboxListItemProps> = ({
  thread,
  handleMessageView,
}): ReactElement => {
  return (
    <div className="">
      <img
        className="relative rounded-full h-10 w-10 z-10"
        src={thread.avatar}
        alt=""
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-1 px-2 rounded" type="button" onClick={() => { handleMessageView(thread); }}>{ thread.username }</button>
    </div>
  );
};

export default InboxListItem;
