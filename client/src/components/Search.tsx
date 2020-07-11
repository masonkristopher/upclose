import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  // const [state, setstate] = useState(initialState);

  const getAllUsers = () => {
    axios
      .get('/user/all')
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };
  getAllUsers();

  return <div className="text-blue">I am the Epic Search</div>;
};

export default Search;
