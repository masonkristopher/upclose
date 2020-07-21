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
  recentMessage: any,
}

const InboxListItem: FC<InboxListItemProps> = ({
  thread,
  handleMessageView,
  recentMessage,
}): ReactElement => {
  return (
    <div className="bg-seaweed justify-center">
      <div className="bg-salmon justify-center">
        <button
          className="bg-salmon text-seaweed font-bold my-1 py-1 px-2 rounded"
          type="button"
          onClick={() => { handleMessageView(thread); }}
        >
          {recentMessage}
        </button>
      </div>
      <div className="flex justify-evenly">
        <img
          className="rounded-full h-10 w-10 z-10 my-8 mx-8"
          src={thread.avatar}
          alt=""
        />
        <p className="text-white font-bold my-8 mx-8">{thread.username}</p>
      </div>
    </div>
  );
};

export default InboxListItem;
