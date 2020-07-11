import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PartySettings from './PartySettings';
import HouseLayout from './HouseLayout';
import Search from "./Search";

interface PartyProfileProps {
  user:{
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  }
}
// party profile is rendered when the route matches /party/partyId
// clicking a house in the neighborhood will take you here, with the partyId
const PartyProfile: FC<PartyProfileProps> = ({ user }) => {
  const [party, setParty]:any = useState({});
  const [users, setUsers]:any = useState([]);
  const [update, setUpdate]: any = useState(true);
  // access the partyId from the route using useParams.
  const { partyId } = useParams();

  useEffect(() => {
    // should query the database and find the party we need on render
    axios.get(`/party/${partyId}`)
      .then((response) => {
      // then use setParty to put the party's info into state
        setParty(response.data);
        // should get all users that have joined this party
        return axios.get(`/party/getUsers/${partyId}`);
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div className="text-blue">
        {party && <h4>party name is: {party.name}</h4>}
        {users && (
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
      </div>
      {/* {users.includes(user) === false && (
        <button type="button"> Would you like to join this party?</button>
      )} */}
      <button type="button">Change House layout</button>
      <button type="button">Change Party Settings</button>
      <Search partyId={partyId} setPartyUpdate={setUpdate} update={update} />
    </div>
  );
};

export default PartyProfile;
