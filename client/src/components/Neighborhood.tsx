import React, { FC } from 'react';
// import axios from 'axios';
import NeighborhoodTabs from './NeighborhoodTabs';
import { User } from '../services/constants';

// our landing page
interface NeighborhoodProps {
  user: User
  parties: any,
}

const Neighborhood: FC<NeighborhoodProps> = ({ user, parties }) => {
  // const [parties, setParties]: any = useState([]);
  // // to do: do we need partyChange at all?
  // const [partyChange, setPartyChange]: any = useState(false);

  // useEffect(() => {
  //   // on load, should populate the parties state with all the user's parties
  //   axios.get(`/party/all/${user.id}`)
  //     .then((response) => {
  //       setParties(response.data);
  //     });
  // }, [partyChange]);

  return (
    <div className="p-10 text-seaweed">
      <h1 className="font-bold text-lg text-seaweed">My Party Neighborhoods</h1>
      <NeighborhoodTabs parties={parties} user={user} />
    </div>
  );
};

export default Neighborhood;
