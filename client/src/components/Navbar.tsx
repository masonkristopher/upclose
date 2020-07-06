import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import UserProfile from './UserProfile';
import Neighborhood from './Neighborhood';
import Messages from './Messages';

const Navbar = () => {
  return (
    <Router>
      <div className="text-blue">
          <ul>
            {/* link to UserProfile */}
            <li><Link to="/profile">Profile</Link></li>
            {/* link to Neighborhood */}
            <li><Link to="/neighborhood">Neighborhood</Link></li>
            {/* link to Logout */}
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
