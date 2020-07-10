import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import TestCreateRoom from './TestCreateRoom';
import TestRoom from './TestRoom';
// import UserContext from './contexts/UserContext';
// import SampleVidChat from './SampleVidChat';

const App = () => {
  const [user, setUser] = useState(null);
  // when the app loads, check if the user is logged in with google
  useEffect(() => {
    // loads the gapi. we use (window as any) b/c gapi does not exist on window until our script
    // in public/index.html creates it
    (window as any).gapi.load('auth2', () => {
      // initializes the GoogleAuth object, which has all the fun methods we need
      (window as any).gapi.auth2
        .init({
          client_id:
            '619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com',
        })
        .then(() => {
          // accesses GoogleAuth object and checks if someone is signed in. returns boolean
          if ((window as any).gapi.auth2.getAuthInstance().isSignedIn.get()) {
            // if someone is signed, get that user object
            const userObj = (window as any).gapi.auth2
              .getAuthInstance()
              .currentUser.get();
            // send the token to our server, which will verify it and give us the user from database
            return axios.post('/user/verify', {
              userObj,
              id_token: userObj.wc.id_token,
            });
          }
        })
        .then((response: any): void => {
          if (response) {
            setUser(response.data);
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    });
  }, []);

  return (
    <div>
      <div>
        I am the almighty App
        <Navbar
          user={user}
          setUser={setUser}
        />
        {/* <SampleVidChat /> */}
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={TestCreateRoom} />
            <Route path="/room/:roomID" component={TestRoom} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
