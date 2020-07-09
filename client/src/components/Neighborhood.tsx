import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import HouseParty from './HouseParty';
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
  const [parties, setParties] = useState({ name: 'hello' });

  useEffect(() => {
    // on load, should populate the parties state
    // axios.get(`/party/all/${user.id}`)
    //   .then((response) => {
    //     setParties(response.data);
    //   });
  }, []);

  return (
    <div className="text-blue flex flex-wrap">
      <h1 className="">
        Welcome to Your Neighborhood, {user.username}!
        {/* <HouseParty partyName="testParty" /> */}
      </h1>
      {parties && (
        <div>
          <div className="relative flex">
            <img src="https://www.clipartmax.com/png/small/76-767905_file-ios-open-house-icon.png" alt="File - Ios - Open House Icon@clipartmax.com" />
            <h3 className="flex absolute inset-x-0 bottom-0 pb-10 pl-10">
              <button type="button" className="text-orange-100 bg-black p-1">Make a new party!</button>
            </h3>
          </div>
          {[1, 2, 3].map((number) => {
            return (
              <div className="relative flex">
                <img src="https://www.clipartmax.com/png/small/76-767905_file-ios-open-house-icon.png" alt="File - Ios - Open House Icon@clipartmax.com" />
                <h3 className="flex absolute inset-x-0 bottom-0 pb-10 pl-10">
                  <button type="button" className="text-orange-100 bg-black p-1">{number}!</button>
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
