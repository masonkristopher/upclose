import React, { FC, ReactElement, useState, useEffect } from 'react';

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
  recentMessages: any,
}

const InboxListItem: FC<InboxListItemProps> = ({
  thread,
  handleMessageView,
  recentMessages,
}): ReactElement => {
  const [latest, setLatest] = useState('');

  useEffect(() => {
    // console.log(recentMessages);
    Object.keys(recentMessages).forEach((id: any) => {
      if (recentMessages[id].idSender === thread.id
        || recentMessages[id].idRecipient === thread.id) {
        setLatest(recentMessages[id].message);
      }
    });
  }, [recentMessages]);

  return (
    <div className="justify-center m-4">
      <div className="bg-salmon justify-center">
        <button
          className="bg-salmon text-seaweed font-bold my-1 py-1 px-2 rounded"
          type="button"
          onClick={() => { handleMessageView(thread); }}
        >
          {latest}
        </button>
      </div>
      <div className="flex p-2">
        <img
          className="rounded-full align-middle h-10 w-10 float-left ml-2"
          src={thread.avatar}
          alt=""
        />
        <p className="text-seaweed align-middle p-2 font-bold">{thread.username}</p>
      </div>
    </div>
  );
};

export default InboxListItem;
