import React, { FC } from 'react';
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
// import UserContext from './contexts/UserContext';

// interface NavbarProps {
//   user: {
//     id: number;
//     nameFirst: string;
//     nameLast: string;
//     username: string;
//     email: string;
//     avatar: string;
//     googleId: string;
//   };
// }

const Navbar = ({
  // these come from App, and will alter App's user
  setUser,
  user,
}: any) => {
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
            {user && (<li className="p-2"><Link to="/testParty/1">Test Party</Link></li>)}
          </ul>

          <ul className="flex items-center">
            {/* in the middle */}
            <li className="p-2"><Link to="/">Home</Link></li>
          </ul>
          {/* <!-- to the right  --> */}
          <ul className="flex items-center">
            {user && (
              <li className="pr-2">
                <GoogleLogout
                  clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
                  buttonText="Logout"
                  onLogoutSuccess={logout}
                />
              </li>
            )}
            {!user && (
              <li className="pl-2">
                <GoogleLogin
                  clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
                  buttonText="Login"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                />
              </li>
            )}
            <li className="p-2">
              {user && (
                <div>
                  <div>
                    Logged in as
                    {' '}
                    {user.username}
                  </div>
                  <img
                    className="rounded-full mx-auto h-6 w-6"
                    src={user.avatar}
                    alt="profile"
                  />
                </div>
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
        <Route path="/testParty/:idParty">
          {user && (
            <HouseParty
              user={user}
            />
          )}
          {!user && (
            <h1>
              Please Log In to go to the party!
            </h1>
          )}
        </Route>
      </Switch>
    </Router>
  );
};

export default Navbar;
