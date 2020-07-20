import React, { FC, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { CSSProperties } from 'styled-components';
import axios from 'axios';
import { User } from '../services/constants';
import PartySettings from './PartySettings';
import Search from './Search';

interface PartyProfileProps {
  user: User
}
// party profile is rendered when the route matches /party/partyId
// clicking a house in the neighborhood will take you here, with the partyId
const PartyProfile: FC<PartyProfileProps> = ({ user }) => {
  const [party, setParty]: any = useState({});
  const [users, setUsers]: any = useState([]);
  const [update, setUpdate]: any = useState(true);
  const [invited, setInvited]: any = useState(false);
  const [changeBackground, setChangeBackground]: any = useState(false);
  const [tempRoomBackgrounds, setTempRoomBackgrounds]: any = useState({ 0: 'red', 1: 'blue', 2: 'green', 3: 'yellow' });
  const [changeName, setChangeName]: any = useState(false);
  const [partyName, setPartyName]: any = useState('');
  const [creator, setCreator]: any = useState(false);
  const [host, setHost]: any = useState();
  // access the partyId from the route using useParams.
  const { partyId }: any = useParams();
  // useHistory allows us to redirect by pushing onto the url
  const history = useHistory();

  const { roomOneBackground, roomTwoBackground, roomThreeBackground, roomFourBackground } = party;
  const backgrounds = [roomOneBackground, roomTwoBackground, roomThreeBackground, roomFourBackground];

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
          });
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
      if (invitedUser.id === party.idCreator) {
        setHost(user);
      }
    });
  }, [users]);

  // once party is updated, set the temporary backgrounds to match the actual party's backgrounds
  useEffect(() => {
    backgrounds.forEach((background, index) => {
      tempRoomBackgrounds[index] = background;
    });
    setTempRoomBackgrounds(tempRoomBackgrounds);
  }, [party]);

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
        setUpdate(!setUpdate);
      });
  };

  const declineInvite = () => {
    // delete user from userParty table, then redirect back to neighborhood
    axios.delete(`/user/userParty/${user.id}/${partyId}`)
      .then(() => {
        history.replace('/neighborhood');
      });
  };

  const editRoomBackgrounds = (e: any, roomNumber: number) => {
    const copy = { ...tempRoomBackgrounds };
    copy[roomNumber] = e.target.value;
    setTempRoomBackgrounds(copy);
  };

  const saveRoomBackgrounds = () => {
    // send a request to update a party
    party.roomOneBackground = tempRoomBackgrounds[0];
    party.roomTwoBackground = tempRoomBackgrounds[1];
    party.roomThreeBackground = tempRoomBackgrounds[2];
    party.roomFourBackground = tempRoomBackgrounds[3];
    axios.put('/party/', { party });
  };

  // when you close the popup by clicking the exit, revert preview to what it used to be
  const exitBackgroundPopup = () => {
    const copy = { ...setTempRoomBackgrounds };
    backgrounds.forEach((background, index) => {
      copy[index] = background;
    });
    setTempRoomBackgrounds(copy);
    setChangeBackground(false);
  };

  // to do: maybe make this height and width more flexible?
  const containerStyle: CSSProperties = {
    height: '300px',
    width: '300px',
    lineHeight: 0,
  };


  return (
    <div className="p-10 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      <div className="">
        <div className="flex">
          {changeName === false && (
            <>
              <h1 className="font-bold text-xl">
                {party.name}
              </h1>
              {creator && (
                <div role="button" tabIndex={0} onClick={() => { setChangeName(true); }} onKeyUp={() => { setChangeName(true); }}>
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
        <div className="mb-2">
          {host && (
            <p>
              Hosted by&nbsp;
              {host.username}
            </p>
          )}
        </div>
        {changeBackground === false && (

          <div className="relative" style={containerStyle}>
            {backgrounds.map((background) => (
              <div
                className={`inline-block bg-my${background}`}
                style={{
                  backgroundImage: `url(${background})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  height: '150px',
                  width: '150px',
                }}
              />
            ))}
          </div>
        )}

        <div className="my-4">
          <button type="button" onClick={() => setChangeBackground(true)} className="bg-seaweed hover:bg-avocado text-white py-1 px-2 font-semibold border border-gray-400 rounded-full shadow">Customize Rooms</button>
          <Popup open={changeBackground === true} onClose={() => { setChangeBackground(false) }}>
            <div className="flex flex-col">
              <h1 className="relative left-0 top-0 pl-4 pt-4 font-bold">Insert a url, or type a basic color</h1>
              <button type="button" className="close absolute top-5 right-5" onClick={() => { exitBackgroundPopup(); }}>
                <svg className="h-4 w-4 fill-current text-seaweed hover:text-salmon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path xmlns="http://www.w3.org/2000/svg" d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                </svg>
              </button>
              <input onChange={(e) => { editRoomBackgrounds(e, 0) }} className="flex max-w-full mt-4 border border-solid border-1" type="text" placeholder="Top left" />
              <input onChange={(e) => { editRoomBackgrounds(e, 1) }} className="flex max-w-full mt-4 border border-solid border-1" type="text" placeholder="Top right" />
              <input onChange={(e) => { editRoomBackgrounds(e, 2) }} className="flex max-w-full mt-4 border border-solid border-1" type="text" placeholder="Bottom left" />
              <input onChange={(e) => { editRoomBackgrounds(e, 3) }} className="flex max-w-full mt-4 border border-solid border-1" type="text" placeholder="Bottom right" />
              <button type="button" onClick={() => { saveRoomBackgrounds(); setChangeBackground(false); }}>Save Images</button>
              <div className="relative" style={containerStyle}>
                {backgrounds.map((background, index) => (
                  <div
                    className={`inline-block bg-my${tempRoomBackgrounds[index]}`}
                    style={{
                      backgroundImage: `url(${tempRoomBackgrounds[index]})`,
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      height: '150px',
                      width: '150px',
                    }}
                  />
                ))}
              </div>
            </div>
          </Popup>
        </div>
      </div>

      <div className="">
        <div className="my-4">
          {party.inviteStatus === 'pending' && (
            <>
              <p>You&apos;ve been invited!</p>
              <button type="button" className="bg-avocado hover:bg-white text-seaweed py-1 px-2 font-semibold border border-gray-400 rounded-full shadow" onClick={() => acceptInvite()}>Accept</button>
              <button type="button" className="bg-salmon hover:bg-white text-seaweed py-1 px-2 font-semibold border border-gray-400 rounded-full shadow" onClick={() => declineInvite()}>Decline</button>
            </>
          )}
        </div>
        <div className="my-4">
          {party && (
            <div className="block">
              {party.inviteStatus === 'accepted' && (
                <div className="mb-4">
                  {(party.inviteOnly === false || (invited === true)) && (
                    <button onClick={goToParty} type="button" className="bg-seaweed hover:bg-caviar text-white py-1 px-2 font-semibold border border-gray-400 rounded-full shadow">Enter Party</button>
                  )}
                </div>
              )}
            </div>
          )}
          {users && !creator && (
            <div>
              {users.map((userInParty: any) => {
                return (
                  <div key={userInParty.username} className="m-2 inline-block">
                    <img src={userInParty.avatar} alt="avatar" className="rounded-full mx-auto h-10 w-10" />
                  </div>
                );
              })}
            </div>
          )}
          {users && creator && (
            <div>
              {users.map((userInParty: any) => {
                return (
                  <div key={userInParty.username} className="m-2 inline-block text-white">
                    <img src={userInParty.avatar} alt="avatar" className="rounded-full mx-auto h-10 w-10 float-left" />
                    <button onClick={() => { removeUser(userInParty.id); }} className="w-6 h-6 bg-salmon rounded-full hover:bg-avocado active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" type="button">x</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <p>Invite more friends:</p>
          <Search
            partyId={partyId}
            setPartyUpdate={setUpdate}
            update={update}
          />
        </div>
      </div>
    </div>
  );
};

export default PartyProfile;
