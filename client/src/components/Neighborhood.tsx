import React, { FC, useEffect, useState } from 'react';
import {
  Link,
} from 'react-router-dom';
import axios from 'axios';
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
  const [parties, setParties] = useState([{ name: 'hello', id: 1 }]);

  useEffect(() => {
    // on load, should populate the parties state with all the user's parties
    axios.get(`/party/all/${user.id}`)
      .then((response) => {
        setParties(response.data);
      });
  }, []);

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
              <button type="button" className="text-orange-100 bg-black p-1">Make a new party</button>
            </h3>
          </div>
          {parties.map((number, index) => {
            return (
              <div key={parties[index].name} className="relative flex">
                <img src="https://www.clipartmax.com/png/small/76-767905_file-ios-open-house-icon.png" alt="File - Ios - Open House Icon@clipartmax.com" />
                <h3 className="flex absolute inset-x-0 bottom-0 pb-10 pl-10">
                  <p className="p-2 text-orange-100 bg-black">{parties[index].name}</p>
                  <p className="p-2 text-orange-100 bg-black"><Link to={`/party/${parties[index].id}`}>Check this party out</Link></p>
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
