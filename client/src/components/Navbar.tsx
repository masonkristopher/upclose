import React, { FC, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { GoogleLogout, GoogleLogin } from 'react-google-login';
import UserProfile from './UserProfile';
import Neighborhood from './Neighborhood';
import Messages from './InboxList';
import HouseParty from './HouseParty';
import PartyProfile from './PartyProfile';

import { User } from '../services/constants';

interface NavbarProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const Navbar: FC<NavbarProps> = ({
  // these come from App, and will alter App's user
  setUser,
  user,
}) => {
  // triggers when a user successfully logs out; should alert the user
  const logout = () => {
    setUser(null);
    console.log('logged out');
  };

  const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;

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
            {user && (<li className="p-2"><Link to="/profile">Profile</Link></li>)}
            {user && (<li className="p-2"><Link to="/neighborhood">Neighborhood</Link></li>)}
            {user && (<li className="p-2"><Link to="/messages">Messages</Link></li>)}
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
