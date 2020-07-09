import React from 'react';
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
import Messages from './Messages';
// import UserContext from './contexts/UserContext';

const Navbar = ({
  // these come from App, and will alter App's user
  setUser,
  user,
}: any) => {
  // triggers when a user successfully logs out; should alert the user and hit our server?
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
        console.log(resp);
        setUser(resp.data);
      });
  };

  return (
  // <UserContext.Consumer>

    <Router>
      <div className="flex-1 flex flex-col">
        <nav className="px-4 flex justify-between bg-white h-16 border-b-2">
          {/* <!-- top bar left --> */}
          <ul className="flex items-center">
            <li className="p-2"><Link to="/profile">Profile</Link></li>
            <li className="p-2"><Link to="/neighborhood">Neighborhood</Link></li>
            <li className="p-2"><Link to="/messages">Messages</Link></li>
          </ul>

          <ul className="flex items-center">
            {/* in the middle */}
            <li>
              <h1 className="pl-5 lg:pl-0 text-gray-700">Im in the middle</h1>
            </li>
          </ul>
          {/* <!-- to the right  --> */}
          <ul className="flex items-center">
            <li className="pr-2">
              <GoogleLogout
                clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
                buttonText="Logout"
                onLogoutSuccess={logout}
              />
            </li>
            <li className="pl-2">
              <GoogleLogin
                clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
              />
            </li>
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
        <Route path="/profile">
          {user && (
            <UserProfile
              user={user}
            />
          )}
          {!user && (
            <h1>
              Loading user
            </h1>
          )}
        </Route>

        <Route path="/neighborhood">
          <Neighborhood
            user={user}
          />
        </Route>
        {/* <Route path="/logout"><Logout /></Route> */}
        <Route path="/messages">
          <Messages
            user={user}
          />
        </Route>
      </Switch>
    </Router>
    // </UserContext.Consumer>
  );
};

export default Navbar;
