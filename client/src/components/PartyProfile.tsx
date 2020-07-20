import React, { FC, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { CSSProperties } from 'styled-components'
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
  const [roomBackgrounds, setRoomBackgrounds]: any = useState({ 0: 'red', 1: 'blue', 2: 'green', 3: 'yellow' });
  const [changeName, setChangeName]: any = useState(false);
  const [partyName, setPartyName]: any = useState('');
  const [creator, setCreator]: any = useState(false);
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

  // to do: this takkes a little bit to run, maybe change it up
  useEffect(() => {
    // should query the database and find the party we need on render
    axios.get(`/party/${partyId}`)
      .then((response) => {
        // should also check the join table to see if accepted or pending
        axios.get(`/party/${user.id}/in/${partyId}`)
          .then((res) => {
            response.data.inviteStatus = res.data.inviteStatus;
            // then use setParty to put the party's info into state
            setParty(response.data);
          })
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
    users.forEach((invitedUser: any) => {
      if (invitedUser.id === user.id) {
        setInvited(true);
      }
      if (user.id === party.idCreator) {
        setCreator(true);
      }
    });
  }, [users]);

  const editPartyName = () => {
    setChangeName(false);
    party.name = partyName;
    axios.put('/party/', { party })
      .then(() => {
        setParty(party);
      });
  };

  const acceptInvite = () => {
    // request to backend to update userParty table, then set state
    axios.put(`/user//userParty/${user.id}/${partyId}/accepted`)
      .then(() => {
        party.inviteStatus = 'accepted';
        // const copy = { ...party }
        // copy.inviteStatus = 'accepted';
        setParty(party);
      });
  };

  const declineInvite = () => {
    // delete user from userParty table, then redirect back to neighborhood
    axios.delete(`/user/userParty/${user.id}/${partyId}`)
      .then(() => {
        history.replace('/neighborhood');
      })
  };

  const editRoomBackgrounds = (e: any, roomNumber: number) => {
    const copy = { ...roomBackgrounds };
    copy[roomNumber] = e.target.value;
    setRoomBackgrounds(copy);
  };

  const saveRoomBackgrounds = () => {
    // send a request to update a party
    party.roomOneBackground = roomBackgrounds[0];
    party.roomTwoBackground = roomBackgrounds[1];
    party.roomThreeBackground = roomBackgrounds[2];
    party.roomFourBackground = roomBackgrounds[3];
    axios.put('/party/', { party });
  };



  const containerStyle: CSSProperties = {
    height: '100px',
    width: '100px',
    lineHeight: 0,
  };

  const { roomOneBackground, roomTwoBackground, roomThreeBackground, roomFourBackground } = party;
  const backgrounds = [roomOneBackground, roomTwoBackground, roomThreeBackground, roomFourBackground];

  return (
    <>
      <div className="relative" style={containerStyle}>
        {backgrounds.map((background, index) => (

          <div
            className={`inline-block bg-${roomBackgrounds[index]}-400`}
            style={{
              backgroundImage: `url(${background})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              height: '50px',
              width: '50px',
            }}
          />
        ))}
      </div>
      <div className="flex flex-col">
        {party.inviteStatus === 'pending' && (
          <>
            <button type="button" className="flex p-6 bg-salmon border-black border-solid border" onClick={() => acceptInvite()}>Accept invitation to join</button>
            <button type="button" className="flex p-6 bg-avocado border-black border-solid border" onClick={() => declineInvite()}>Decline invitation to join</button>
          </>
        )}
        <div className="flex flex-col">
          {party && (
            <div className="flex flex-col">
              {party.inviteStatus === 'accepted' && (
                <div>
                  <p> You have accepted this invitation</p>
                </div>
              )}
              <div className="flex flex-row">
                {changeName === false && (
                  <>
                    <h4>
                      party name is:
                      {party.name}
                    </h4>
                    {creator && (
                      <div role="button" tabIndex={0} onClick={() => { setChangeName(true) }} onKeyUp={() => { setChangeName(true) }}>
                        <img className="h-4 w-4 ml-2" alt="edit" src="https://www.pngfind.com/pngs/m/70-704184_png-file-svg-pencil-edit-icon-png-transparent.png" />
                      </div>
                    )}
                  </>
                )}
                {changeName && (
                  <>
                    <input onChange={(e) => setPartyName(e.target.value)} placeholder="New party name?" />
                    <button type="button" onClick={editPartyName}>submit</button>
                  </>
                )}
              </div>
            </div>
          )}
          {users && !creator && (
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
          {users && creator && (
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
        <button type="button" onClick={() => setChangeBackground(true)}>Change Room backgrounds</button>
        <Popup open={changeBackground === true} onClose={() => { setChangeBackground(false) }}>
          <div className="flex flex-col">
            <h1 className="relative left-0 top-0 pl-4 pt-4 font-bold">Insert a url, or type a basic color</h1>
            <button type="button" className="close absolute top-5 right-5" onClick={() => { setChangeBackground(false) }}>
              <svg className="h-4 w-4 fill-current text-seaweed hover:text-salmon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path xmlns="http://www.w3.org/2000/svg" d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
              </svg>
            </button>
            <input onChange={(e) => { editRoomBackgrounds(e, 0) }} className="flex max-w-full mt-4 border border-solid border-1" type="text" defaultValue={roomOneBackground} />
            <input onChange={(e) => { editRoomBackgrounds(e, 1) }} className="flex max-w-full mt-4 border border-solid border-1" type="text" defaultValue={roomTwoBackground} />
            <input onChange={(e) => { editRoomBackgrounds(e, 2) }} className="flex max-w-full mt-4 border border-solid border-1" type="text" defaultValue={roomThreeBackground} />
            <input onChange={(e) => { editRoomBackgrounds(e, 3) }} className="flex max-w-full mt-4 border border-solid border-1" type="text" defaultValue={roomFourBackground} />
            <button type="button" onClick={() => { saveRoomBackgrounds(); setChangeBackground(false) }}>Save Images</button>
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
    </>
  );
};

export default PartyProfile;
