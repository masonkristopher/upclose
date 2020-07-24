import React, {
  FC, ReactElement, useState, useEffect,
} from 'react';

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
  const [messageObj, setMessageObj]: any = useState({});
  useEffect(() => {
    // console.log(recentMessages);
    Object.keys(recentMessages).forEach((id: any) => {
      if (recentMessages[id].idSender === thread.id
        || recentMessages[id].idRecipient === thread.id) {
        setMessageObj(recentMessages[id]);
        setLatest(recentMessages[id].message);
      }
    });
  }, [recentMessages]);

  return (
    <div 
      className="justify-center"
    >
      {messageObj.idSender === thread.id ? (
        <div>
          <div
            className="speech-bubble-left"
            onClick={() => {
              handleMessageView(thread);
            }}
          >
            <p>
              <strong>{latest}</strong>
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
            className="speech-bubble-right"
            onClick={() => {
              handleMessageView(thread);
            }}
          >
            <p>
              <strong>{latest}</strong>
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
