import React from 'react';
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

const Navbar = ( {setAppsUser}:any ) => {
  // triggers when a user successfully logs out; should alert the user and hit an endpoint in our server?
  const logout = () => {
    console.log('logged out');
  };

  // the response from google after the login
  const responseGoogle = (response: any) => {
    /* after a user successfully signs in,
    send the user's ID token to your server using HTTPS.
    axios.post('/verify', {
      id_token: response.tokenId
    })
    Then, on the server, verify the integrity of the ID token and
    axios.get('https://oauth2.googleapis.com/tokeninfo', {
      id_token,
    })
    use the user information contained in the token to establish a session or create a new account.
    alert the user that they have signed in, probs by changing state using setAppsUser and also setUser in Navbar?
    */

    console.log(response);
  };

  return (
    <Router>
      <div className="text-blue">
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
