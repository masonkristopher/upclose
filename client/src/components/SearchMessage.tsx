import React, { useState, useEffect, KeyboardEvent } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';

interface IProps {
    user: {
        id: number,
        nameFirst: string,
        nameLast: string,
        username: string,
        email: string,
        avatar: string,
        googleId: string,
    },
}

const SearchMessage = ({ setClickedUser, showMessages, setShowMessages }: any) => {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [matches, setMatches]: any = useState([]);

  const fuse = new Fuse(users, {
    keys: ['username', 'nameFirst', 'nameLast'],
  });

  const getAllUsers = () => {
    return axios
      .get('/user/all')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleMatches = () => {
    const results: any = fuse.search(input);
    setMatches(results);
  };

  const openMessageView = (data: any) => {
    setClickedUser(data.item);
    setShowMessages(!showMessages);
  };

  const onKeyPress = (event: KeyboardEvent) => {
    if (event.which === 13) handleMatches();
  };

  return (
    <div className="flex flex-wrap -mx-4 overflow-hidden">
      <div className="my-2 px-3 w-1/2 overflow-hidden">
        <div className="shadow flex">
          <input onChange={(e) => setInput(e.target.value)} onKeyPress={onKeyPress} className="w-full rounded p-2 border-1 border-gray-400" type="text" value={input} id="grid-password" placeholder="Search a user..." />
          <button type="button" className="bg-gray-200 w-auto flex justify-end items-center text-salmon p-2" onClick={() => handleMatches()}>
            <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current hover:text-avocado">
              <path xmlns="http://www.w3.org/2000/svg" d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          {matches.length >= 1
            ? matches.map((match: any) => (
              <div key={match.item.googleId} className="flex items-center">
                <img className="w-10 h-10 rounded-full m-2" src={match.item.avatar} alt="Avatar" />
                <div className="mr-3">
                  <p className="text-gray-900 text-base leading-none">{match.item.username}</p>
                </div>
                <div className="mr-4 text-white">
                  <button
                    type="button"
                    className="bg-avocado hover:text-white text-seaweed font-bold my-1 py-1 px-2 rounded"
                    onClick={() => openMessageView(match)}
                  >
                    Message
                  </button>
                </div>
              </div>
            ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default SearchMessage;
