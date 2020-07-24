import React, { FC, ReactElement, useState, useEffect } from "react";

interface InboxListItemProps {
  thread: {
    id: number;
    nameFirst: string;
    nameLast: string;
    username: string;
    email: string;
    avatar: string;
    googleId: string;
  };
  handleMessageView: any;
  recentMessages: any;
}

const InboxListItem: FC<InboxListItemProps> = ({
  thread,
  handleMessageView,
  recentMessages,
}): ReactElement => {
  const [latest, setLatest]: any = useState({});

  useEffect(() => {
    Object.keys(recentMessages).forEach((id: any) => {
      if (
        recentMessages[id].idSender === thread.id ||
        recentMessages[id].idRecipient === thread.id
      ) {
        setLatest(recentMessages[id]);
      }
    });
  }, [recentMessages]);
  return (
    <div className="justify-center">
      {latest.idSender === thread.id ? (
        <div>
          <div
            className="speech-bubble-left clickDIV"
            onClick={() => {
              handleMessageView(thread);
            }}
          >
            <p>
              <strong>{latest.message}</strong>
            </p>
          </div>
          <div className="flex p-2">
            <img
              className="rounded-full align-middle h-10 w-10 float-left ml-2"
              src={thread.avatar}
              alt=""
            />
            <p className="text-seaweed align-middle p-2 font-bold">
              {thread.username}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="speech-bubble-right clickDIV"
            onClick={() => {
              handleMessageView(thread);
            }}
          >
            <p>
              <strong>{latest.message}</strong>
            </p>
          </div>
          <div className="flex p-2">
            <img
              className="rounded-full align-middle h-10 w-10 float-left ml-2"
              src={thread.avatar}
              alt=""
            />
            <p className="text-seaweed align-middle p-2 font-bold">
              {thread.username}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxListItem;
