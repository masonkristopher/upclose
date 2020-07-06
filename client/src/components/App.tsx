import React from 'react';
import { GoogleLogout, GoogleLogin } from 'react-google-login';
import Navbar from './Navbar';

const App = () => {

  const responseGoogle = (response: any) => {
    console.log(response);
  };

  const logout = () => {
    console.log('logged out');
  };

  return (
    <div className="text-red-700">
      I am the almighty App
      <Navbar />
      <GoogleLogin
        clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        // isSignedIn={true}
      />

      <GoogleLogout
        clientId="619935015421-c9vv4mlcuabiotbke4dpnc2ehp760l3a.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={logout}
      />

    </div>
  );
};

export default App;
