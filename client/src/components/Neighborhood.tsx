import React, { FC, useEffect, useState } from 'react';
import {
  Link,
} from 'react-router-dom';
import axios from 'axios';
import CreatePartyPopup from './CreatePartyPopup';

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

  const deleteParty = (partyId: number) => {
    axios.delete(`/party/${partyId}`)
      .then(() => {
        setPartyChange(!partyChange);
      });
  };

  return (
    <div className="p-8 text-seaweed">
      <h1 className="">My Party Neighborhoods</h1>
      <div>All | Public | Private | Invites</div>
      {parties && (
        <div className="flex flex-row flex-wrap">
          <div className="relative flex justify-center px-8 py-10">
            <svg className="h-house w-house fill-current text-seaweed" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path xmlns="http://www.w3.org/2000/svg" d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" />
            </svg>
            <p className="absolute top-1/2 left-auto font-bold text-white text-xl">NEW</p>
            <h4 className="absolute bottom-0 left-auto">
              <CreatePartyPopup
                user={user}
              />
            </h4>
          </div>
          {parties.map((party: any) => {
            const houseColor = party.inviteOnly ? 'salmon' : 'avocado';
            return (
              <div key={party.name} className="relative flex justify-center px-8 py-10">
                <svg className={`h-house w-house fill-current text-${houseColor}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path xmlns="http://www.w3.org/2000/svg" d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" />
                </svg>
                <h4 className="absolute bottom-0 left-auto">
                  <Link to={`/partyProfile/${party.id}`}>
                    <button type="button" className="bg-white hover:text-salmon text-gray-800 py-1 px-2 font-semibold border border-gray-400 rounded-full shadow">
                      {party.name}
                      {/* Test Texting just checking */}
                    </button>
                  </Link>
                  {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-1 px-2 rounded" type="button" onClick={() => { deleteParty(parties[index].id); }}>Delete party</button> */}
                </h4>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Neighborhood;
