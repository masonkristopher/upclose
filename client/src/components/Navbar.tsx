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

const Navbar = ({
  // these come from App, and will alter App's user
  setUser,
  user,
}:any) => {
// triggers when a user successfully logs out; should alert the user and hit our server?
  const logout = () => {
    setUser(null);
    console.log('logged out');
  };

  // the response from google after the login
  const responseGoogle = (response: any) => {
    // after a user successfully signs in,
    // send the user's ID token to your server using HTTPS.
    axios.post('/user/verify', {
      id_token: response.tokenId,
    })
      .then((resp) => {
        console.log(resp);
        setUser(resp.data);
      });
    // Then, on the server, verify the integrity of the ID token and
    // use the user information contained in the token to establish a session or create a new account.
    // alert the user that they have signed in, probs by changing state using setAppsUser and also setUser in Navbar?
    

    console.log(response);
  };

  return (
    <Router>
      <div className="text-blue">
        {user && (
          <div>Logged in as {user.username}</div>
        )}
        <ul>
          {/* link to UserProfile */}
          <li><Link to="/profile">Profile</Link></li>
          {/* link to Neighborhood */}
          <li><Link to="/neighborhood">Neighborhood</Link></li>
          {/* link to Logout */}
          <li>
            <GoogleLogout
              clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
              buttonText="Logout"
              onLogoutSuccess={logout}
            />
          </li>
          <li>
            <GoogleLogin
              clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
            // isSignedIn={true}
            />
          </li>
          {/* <li><Link to="/logout">Logout</Link></li> */}
          {/* link to Messages */}
          <li><Link to="/messages">Messages</Link></li>
        </ul>
      </div>

      <Switch>
        <Route path="/profile"><UserProfile /></Route>
        <Route path="/neighborhood"><Neighborhood /></Route>
        {/* <Route path="/logout"><Logout /></Route> */}
        <Route path="/messages"><Messages /></Route>
      </Switch>
    </Router>
  );
};

export default Navbar;
