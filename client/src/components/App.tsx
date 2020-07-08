import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import ChatRoom from './ChatRoom';

import Navbar from './Navbar';
// import SampleVidChat from './SampleVidChat';

const App = () => {
  return (
    <div className="text-red-700">
      I am the almighty App
      <Navbar />
      {/* <SampleVidChat /> */}
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={CreateRoom} />
          <Route path="/room/:roomID" component={ChatRoom} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
