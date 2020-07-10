import React from 'react';
import { v1 as uuid } from 'uuid';

const TestCreateRoom = (props) => {
  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }

  return (
    <button onClick={create}>Create room</button>
  );
};

export default TestCreateRoom;
