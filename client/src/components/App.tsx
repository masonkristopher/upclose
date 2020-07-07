import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const App = () => {

  const [user, setUser] = useState({});
  // when the app loads, check if the user is logged in with google
  useEffect(() => {
    // loads the gapi
    (window as any).gapi.load('auth2', () => {
      // initializes the GoogleAuth object, which has all the fun methods we need
      (window as any).gapi.auth2.init({
        client_id: '619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com',
      })
        .then(() => {
          // accesses GoogleAuth object and checks if someone is signed in. returns boolean
           (window as any).gapi.auth2.getAuthInstance().isSignedIn.get();
        })
      /* Ready. Make a call to gapi.auth2.init or some other API */
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
      </div>

    </div>
  );
};

export default App;
