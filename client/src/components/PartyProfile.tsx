import React, { FC, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
import axios from 'axios';
import PartySettings from './PartySettings';
import Search from './Search';

interface PartyProfileProps {
  user: {
    id: number;
    nameFirst: string;
    nameLast: string;
    username: string;
    email: string;
    avatar: string;
    googleId: string;
  };
}
// party profile is rendered when the route matches /party/partyId
// clicking a house in the neighborhood will take you here, with the partyId
const PartyProfile: FC<PartyProfileProps> = ({ user }) => {
  const [party, setParty]: any = useState({});
  const [users, setUsers]: any = useState([]);
  const [update, setUpdate]: any = useState(true);
  const [invited, setInvited]: any = useState(false);
  const [changeBackground, setChangeBackground]: any = useState(false);
  const [roomBackgrounds, setRoomBackgrounds]: any = useState({1: 'red', 2: 'blue', 3: 'green', 4: 'yellow' });
  // access the partyId from the route using useParams.
  const { partyId }: any = useParams();
  // useHistory allows us to redirect by pushing onto the url
  const history = useHistory();

  const goToParty = () => {
    history.replace(`/party/${partyId}`);
  };

  const removeUser = (userId: number) => {
    // remove a user from the UserParty table and re-render
    axios.delete(`/user/userParty/${userId}/${party.id}`)
      .then(() => {
        setUpdate(!setUpdate);
      });
  };

  // runs once, on load
  useEffect(() => {
    // should query the database and find the party we need on render
    axios.get(`/party/${partyId}`)
      .then((response) => {
        // then use setParty to put the party's info into state
        setParty(response.data);
        return axios.get(`/party/getUsers/${partyId}`)
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // runs whenever update is changed, which happens in other components
  useEffect(() => {
    // get all users that have joined this party and set them in state
    axios.get(`/party/getUsers/${partyId}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.error(err));
  }, [update]);

  // watches users for changes, then checks that the logged in user is an invited user
  useEffect(() => {
    users.forEach((invitedUser: any, index: number) => {
      if (invitedUser.id === user.id) {
        setInvited(true);
      } else if (index === users.length - 1) {
        setInvited(false);
      }
    });
  }, [users]);

  const editPartyName = () => {
    // should pop up a thing to edit the name
    // send a request to edit party in the database
    // update state
    console.log('hello')
  };

  const editRoomBackgrounds = (e:any, roomNumber: number) => {
    const copy = {...roomBackgrounds};
    copy[roomNumber] = e.target.value;
    setRoomBackgrounds(copy);
  };

  const saveRoomBackgrounds = () => {
    // send a request to update a party
    // console.log(party, 'before')
    party.roomOneBackground = roomBackgrounds[1];
    party.roomTwoBackground = roomBackgrounds[2];
    party.roomThreeBackground = roomBackgrounds[3];
    party.roomFourBackground = roomBackgrounds[4];
    axios.put('/party/', { party });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {party && (
          <div className="flex flex-row">
            <h4>
              party name is:
              {party.name}
            </h4>
            <div role="button" tabIndex={0} onClick={editPartyName} onKeyUp={editPartyName}>
              <img className="h-4 w-4 ml-2" alt="edit" src="https://www.pngfind.com/pngs/m/70-704184_png-file-svg-pencil-edit-icon-png-transparent.png" />

            </div>
          </div>
        )}
        {users && user.id !== party.idCreator && (
          <h4>
            Users involved in this party:
            <ul>
              {users.map((userInParty: any) => {
                return (
                  <li key={userInParty.username}>{userInParty.username}</li>
                );
              })}
            </ul>
          </h4>
        )}
        {users && user.id === party.idCreator && (
          <div>
            <h4>
              Users involved in this party:
              <ul>
                {users.map((userInParty: any) => {
                  return (
                    <div className="grid-cols-2 grid">
                      <li key={userInParty.username}>{userInParty.username}</li>
                      <button onClick={() => { removeUser(userInParty.id); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-1 px-2 rounded" type="button">Remove from party</button>
                    </div>
                  );
                })}
              </ul>
            </h4>
          </div>
        )}
      </div>
      <button type="button">Change House layout</button>
      <button type="button" onClick={() => setChangeBackground(true)}>Change Room backgrounds</button>
      <Popup open={changeBackground === true} onClose={() => {setChangeBackground(false)}}>
        <div className="flex flex-col">
          <input onChange={(e) => {editRoomBackgrounds(e, 1)}} className="flex max-w-full mt-4 border border-solid border-1" type="text" value={roomBackgrounds[1]} />
          <input onChange={(e) => {editRoomBackgrounds(e, 2)}} className="flex max-w-full mt-4 border border-solid border-1" type="text" value={roomBackgrounds[2]} />
          <input onChange={(e) => {editRoomBackgrounds(e, 3)}} className="flex max-w-full mt-4 border border-solid border-1" type="text" value={roomBackgrounds[3]} />
          <input onChange={(e) => {editRoomBackgrounds(e, 4)}} className="flex max-w-full mt-4 border border-solid border-1" type="text" value={roomBackgrounds[4]} />
          <button type="button" onClick={() => {saveRoomBackgrounds(); setChangeBackground(false)}}>Save Images</button>
        </div>
      </Popup>
      {(party.inviteOnly === false || (invited === true)) && (
        <button onClick={goToParty} type="button">Go to this party!</button>
      )}

      <Search
        partyId={partyId}
        setPartyUpdate={setUpdate}
        update={update}
      />
    </div>
  );
};

export default PartyProfile;
