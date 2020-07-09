import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
// import SampleVidChat from './SampleVidChat';

const App = () => {
  const [user, setUser] = useState({});
  // when the app loads, check if the user is logged in with google
  useEffect(() => {
    // loads the gapi. we have to use (window as any) b/c gapi does not exist on window until our script
    // in public/index.html creates it
    (window as any).gapi.load('auth2', () => {
      // initializes the GoogleAuth object, which has all the fun methods we need
      (window as any).gapi.auth2.init({
        client_id: '619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com',
      })
        .then(() => {
          // accesses GoogleAuth object and checks if someone is signed in. returns boolean
          if ((window as any).gapi.auth2.getAuthInstance().isSignedIn.get()) {
            // if someone is signed, get that user object
            const userObj = (window as any).gapi.auth2.getAuthInstance().currentUser.get();
            console.log(userObj, 'right before post to /user/verify');
            // send the token to our server, which will verify it and give us the user from database
            return axios.post('/user/verify', {
              id_token: userObj.wc.id_token,
            });
          }
        })
        .then((response: any):void => {
          // response.data right now is just the googleId, but it should be a user object
          setUser(response.data);
        });
    });
  }, []);

  return (
    <div>
      <div className="text-red-700">
        I am the almighty App
        <Navbar
          user={user}
          setUser={setUser}
        />
        {/* <SampleVidChat /> */}
      </div>

    </div>
  );
};

export default App;
