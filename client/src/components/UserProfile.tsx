import React, { useState, FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import EditUserDetails from './EditUserDetails';

interface UserProfileProps {
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  },
  setUser: any
}

const UserProfile: FC<UserProfileProps> = ({ user, setUser }) => {
  const [showEditForm, setShowEditForm]: any = useState(false);
  const [parties, setParties]: any = useState([]);
  const [partyChange, setPartyChange]: any = useState(false);

  const history = useHistory();

  useEffect(() => {
    axios.get(`/party/all/${user.id}`)
      .then((response) => {
        setParties(response.data);
      })
      .catch(err => console.error(err));
  }, [partyChange]);

  const toParty = (partyId: number) => {
    history.replace(`/partyProfile/${partyId}`);
  };

  const deleteParty = (partyId: number) => {
    axios.delete(`/party/${partyId}`)
      .then(() => {
        setPartyChange(!partyChange);
      });
  };

  return (
    <div className="grid grid-cols-2">
      <div className="p-8 content-center flex">
        {showEditForm ? (
          <EditUserDetails setShowEditForm={setShowEditForm} user={user} setUser={setUser} />
        ) : (
          <div>
            <img
              className="flex-col object-cover rounded-full p-4 max-w-sm max-h-sm"
              src={user.avatar}
              alt={user.username}
            />
            <h3>Username</h3>
            <p className="text-gray-900 font-bold text-xl mb-2">
              {user.username}
            </p>
            <h3>First Name</h3>
            <p className="text-gray-900 font-bold text-xl mb-2">
              {user.nameFirst}
            </p>
            <h3>Last Name</h3>
            <p className="text-gray-900 font-bold text-xl mb-2">
              {user.nameLast}
            </p>
            <h3>Email</h3>
            <p className="text-gray-900 font-bold text-xl mb-2">{user.email}</p>
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4"
              type="button"
            >
              Edit User Details
            </button>
          </div>
        )}
      </div>
      <div>
        {parties && (
          <h1>
            Your parties:
            <ul>
              {parties.map((party: any) => (
                <div key={party.id} className="grid grid-cols-2">
                  <li>
                    <button type="button" onClick={() => { toParty(party.id); }}>{party.name}</button>
                  </li>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-1 px-2 rounded" type="button" onClick={() => { deleteParty(party.id); }}>Delete party</button>
                </div>
              ))}
            </ul>
          </h1>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
