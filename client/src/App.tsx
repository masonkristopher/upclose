import React,{ useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {

  const [test, setTest] = useState('');

  const sendRequest = () => {
    axios.get('/api')
      .then(res => {
        setTest(res.data);
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {test && (
          <div>{test}</div>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={sendRequest}>send request</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
