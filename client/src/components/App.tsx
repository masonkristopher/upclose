import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const App = () => {
  const [user, setUser] = useState({});

  const sendRequest = () => {
    axios.get('/api')
      .then((response) => { console.log(response); });
  }

  return (
    <div>
      <button type="button" onClick={sendRequest}>send request</button>
      <div className="text-red-700">
        I am the almighty App
        <Navbar
          setAppsUser={setUser}
        />
      </div>

    </div>
  );
};

export default App;
