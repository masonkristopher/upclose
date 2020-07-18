import React, { FC, useEffect, useState } from 'react';
import {
  Link,
} from 'react-router-dom';
import axios from 'axios';
import CreatePartyPopup from './CreatePartyPopup';
import NeighborhoodTabs from './NeighborhoodTabs';

// our landing page
interface NeighborhoodProps {
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  }
}

const Neighborhood: FC<NeighborhoodProps> = ({ user }) => {
  // to do: ******************
  // i want this useState to be empty or null, but typescript doesn't like that
  // const [parties, setParties] = useState([{ name: '', id: 1 }]);
  const [parties, setParties]: any = useState([]);
  const [partyChange, setPartyChange]: any = useState(false);

  useEffect(() => {
    // on load, should populate the parties state with all the user's parties
    axios.get(`/party/all/${user.id}`)
      .then((response) => {
        setParties(response.data);
      });
  }, [partyChange]);

  // const deleteParty = (partyId: number) => {
  //   axios.delete(`/party/${partyId}`)
  //     .then(() => {
  //       setPartyChange(!partyChange);
  //     });
  // };

  return (
    <div className="p-10 text-seaweed">
      <h1 className="font-bold text-lg text-seaweed">My Party Neighborhoods</h1>
      <NeighborhoodTabs parties={parties} user={user} />
    </div>
  );
};

export default Neighborhood;
