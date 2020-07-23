import React, { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { GoogleLogout, GoogleLogin } from 'react-google-login';
import { debounce } from 'lodash';
import UserProfile from './UserProfile';
import Neighborhood from './Neighborhood';
import Messages from './InboxList';
import HouseParty from './HouseParty';
import PartyProfile from './PartyProfile';

import { User, Party } from '../services/constants';

interface NavbarProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const Navbar: FC<NavbarProps> = ({
  // these come from App, and will alter App's user
  setUser,
  user,
}) => {
  const [parties, setParties] = useState([]);
  const [hasPending, setHasPending] = useState(false);

  const getParties = () => {
    if (user) {
      axios.get(`/party/all/${user.id}`)
        .then((response) => {
          setParties(response.data);
        });
    }
  };

  const debouncedGetParties = debounce(getParties, 3500);

  useEffect(() => {
    debouncedGetParties();
  });

  // checks that none of the parties has a pending invite
  useEffect(() => {
    let needsToChange = false;
    parties.forEach((party: Party) => {
      if (party.inviteStatus === 'pending') {
        needsToChange = true;
      }
    });
    setHasPending(needsToChange);
  }, [parties]);

  // triggers when a user successfully logs out; should alert the user
  const logout = () => {
    setUser(null);
    console.log('logged out');
  };

  // the response from google after the login
  const responseGoogle = (response: any) => {
    // after a user successfully signs in,
    // send the user's ID token to your server using HTTPS.
    return axios.post('/user/verify', {
      userObj: user,
      id_token: response.tokenId,
    })
      .then((resp) => {
        setUser(resp.data);
      });
  };

  return (
    <Router>
      <div className="flex-1 flex flex-col">
        <nav className="px-4 flex justify-between bg-white h-16 border-b-2">
          {/* <!-- top bar left --> */}
          <ul className="flex items-center">
            {user && (<li className="p-2 flex"><Link to="/profile">Profile</Link></li>)}
            {user && hasPending === false && (<li className="p-2 flex"><Link to="/neighborhood">Neighborhood</Link></li>)}
            {user && hasPending && (
            <li className="p-2 flex">
              <div className="relative flex justify-center py-1">
                <img className="absolute top-0 right-0 h-3 w-3" src="https://img.icons8.com/color/344/high-importance--v1.png" alt="notification" />
                <Link to="/neighborhood">Neighborhood</Link>
              </div>
            </li>
            )}
            {user && (<li className="p-2 flex"><Link to="/messages">Messages</Link></li>)}
          </ul>

          <ul className="flex items-center">
            {/* in the middle */}
            <li className="p-2"><Link to="/">Home</Link></li>
          </ul>
          {/* <!-- to the right  --> */}
          <ul className="flex items-left">
            {user && (
              <li className="p-2">
                <GoogleLogout
                  clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
                  buttonText="Logout"
                  onLogoutSuccess={logout}
                />
              </li>
            )}
            {!user && (
              <li className="p-2">
                <GoogleLogin
                  clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
                  buttonText="Login"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                />
              </li>
            )}
            <li className="px-1 pt-1">
              {user && (
                <img
                  className="rounded-full h-12 w-12 m-1 mr-3 float-left"
                  src={user.avatar}
                  alt="profile"
                />
              )}
            </li>
            <li className="pt-3">
              {user && (
                <p className="text-xs text-gray-500">
                  Logged in as
                  <br />
                  {user.username}
                </p>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <Switch>
        <Route path="/partyProfile/:partyId">
          {user && (
            <PartyProfile
              user={user}
            />
          )}
          {!user && (
            <h1>
              Please Log In to see this party!
            </h1>
          )}
        </Route>
        <Route path="/profile">
          {user && (
            <UserProfile
              user={user}
              setUser={setUser}
            />
          )}
          {!user && (
            <h1>
              Loading user
            </h1>
          )}
        </Route>

        <Route path="/neighborhood">
          {user && (
            <Neighborhood
              user={user}
            />
          )}
          {!user && (
            <h1>Please log in!</h1>
          )}
        </Route>

        <Route path="/party/:partyId">
          {user && (
            <HouseParty
              user={user}
            />
          )}
          {!user && (
            <h1>Please log in!</h1>
          )}
        </Route>

        <Route path="/messages">
          {user && (
            <Messages
              user={user}
            />
          )}
          {!user && (
            <h1>
              Please Log In to see your messages!
            </h1>
          )}
        </Route>
      </Switch>
    </Router>
  );
};

export default Navbar;
