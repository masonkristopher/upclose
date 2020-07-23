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

  const removeUser = (userId: number, partyId: number) => {
    axios.delete(`/user/userParty/${userId}/${partyId}`)
      .then(() => {
        setPartyChange(!partyChange);
      });
  };

  return (
    <div className="grid grid-cols-4">
      <div></div>
      {showEditForm ? (
        <EditUserDetails setShowEditForm={setShowEditForm} user={user} setUser={setUser} />
      ) : (
        <div className="mt-20">
          <div className="max-w-md mx-auto py-4 px-8 bg-white shadow-lg rounded-lg">
            <div className="flex justify-center md:justify-end -mt-16">
              <img className="w-30 h-30 object-cover rounded-full border-4 border-white shadow-lg" alt="Testimonial avatar" src={user.avatar} />
            </div>

            <h2 className="text-gray-800 text-2xl mt-2 md:mt-0 md:text-3xl font-semibold">{user.username}</h2>
            <p className="mt-2 text-gray-600">{user.email}</p>
            <p className="mt-2 text-gray-600">
              Full name:
              &nbsp;
              {user.nameFirst}
              &nbsp;
              {user.nameLast}
            </p>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowEditForm(!showEditForm)}
                className="rounded shadow-md flex items-center bg-seaweed px-4 py-2 text-white hover:text-salmon"
              >
                Edit User Details
              </button>
            </div>
          </div>
        </div>
      )}
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
                  {user.id === party.idCreator && (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-1 px-2 rounded" type="button" onClick={() => { deleteParty(party.id); }}>
                      Delete party
                    </button>
                  )}
                  {user.id !== party.idCreator && (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-1 px-2 rounded" type="button" onClick={() => { removeUser(user.id, party.id); }}>
                      Leave party
                    </button>
                  )}

                </div>
              ))}
            </ul>
          </h1>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default UserProfile;
