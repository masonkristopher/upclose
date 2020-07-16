import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';

const SearchPopup = ({ setInvitees, user, saveParty, setPopupNumber }: any) => {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [matches, setMatches]: any = useState([]);
  const [tempInvitees, setTempInvitees]: any = useState([]);

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

  const inviteUser = (invitee: any) => {
    // add the user to CreatePartyPopup's state, but only if it's not there already
    if (!tempInvitees.includes(invitee) && user !== invitee) {
      const array = tempInvitees.concat(invitee);
      setTempInvitees(array);
      setInvitees(array);
    }
  };

  const removeUser = (invitee: any) => {
    const array = [...tempInvitees];
    const index = array.indexOf(invitee);
    array.splice(index, 1);
    setTempInvitees(array);
    setInvitees(array);
  };

  return (
    <div className="relative h-full w-full">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <ul className="float-right">
            Invited people:
            {tempInvitees.map((invitee: any) => (
              <div className="flex flex-row">
                <li key={invitee.username}>{invitee.username}</li>
                <button className="ml-2" type="button" onClick={() => { removeUser(invitee); }}>Remove</button>
              </div>
            ))}
          </ul>
          <input
            onChange={(e) => setInput(e.target.value)}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-password"
            type="text"
            value={input}
          />
          <button
            onClick={() => handleMatches()}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4"
            type="button"
          >
            Search
          </button>
          <button type="button" className="relative bottom-0 my-2 border border-solid border-1 bg-blue-600 text-orange-300 px-2 max-w-full mb-6" onClick={() => { saveParty(); setPopupNumber(0); }}>Confirm Invites</button>
        </div>
      </div>
      <div>
        {matches.length >= 1
          ? matches.map((match: any) => (
            <div>
              <img
                className="rounded-full mx-auto h-6 w-6"
                src={match.item.avatar}
                alt="avatar"
              />
              <li>{match.item.username}</li>
              <button
                onClick={() => inviteUser(match.item)}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4"
                type="button"
              >
                Add
              </button>
            </div>
          ))
          : null}
      </div>
    </div>
  );
};

export default SearchPopup;
