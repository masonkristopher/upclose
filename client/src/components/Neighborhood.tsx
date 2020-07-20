import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
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
  const [parties, setParties]: any = useState([]);
  // to do: do we need partyChange at all?
  const [partyChange, setPartyChange]: any = useState(false);

  useEffect(() => {
    // on load, should populate the parties state with all the user's parties
    axios.get(`/party/all/${user.id}`)
      .then((response) => {
        setParties(response.data);
      });
  }, [partyChange]);

  return (
    <div className="p-10 text-seaweed">
      <h1 className="font-bold text-lg text-seaweed">My Party Neighborhoods</h1>
      <NeighborhoodTabs parties={parties} user={user} />
    </div>
  );
};

export default Neighborhood;
