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
  const [parties, setParties] = useState([{ name: '', id: 1 }]);
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
      })
  };

  return (
    <div className="text-blue flex flex-wrap">
      <h1 className="">
        Welcome to Your Neighborhood, {user.username}!
      </h1>
      {parties && (
        <div>
          <div className="relative flex">
            <img src="https://www.clipartmax.com/png/small/76-767905_file-ios-open-house-icon.png" alt="File - Ios - Open House Icon@clipartmax.com" />
            <h3 className="flex absolute inset-x-0 bottom-0 pb-10 pl-10">
              <CreatePartyPopup
                user={user}
              />
            </h3>
          </div>
          {parties.map((number, index) => {
            return (
              <div key={parties[index].name} className="relative flex">
                <img src="https://www.clipartmax.com/png/small/76-767905_file-ios-open-house-icon.png" alt="File - Ios - Open House Icon@clipartmax.com" />
                <h3 className="flex absolute inset-x-0 bottom-0 pb-10 pl-10">
                  <p className="p-2 text-orange-100 bg-red-800">{parties[index].name}</p>
                  <p className="p-2 text-orange-100 bg-black"><Link to={`/partyProfile/${parties[index].id}`}>Check this party out</Link></p>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-1 px-2 rounded" type="button" onClick={() => { deleteParty(parties[index].id); }}>Delete party</button>
                </h3>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Neighborhood;
