import React from 'react';
import PartySettings from './PartySettings';
import HouseLayout from './HouseLayout';

const PartyProfile = () => {
  return (
    <div>
      <div className="text-blue">
        I am the beautiful PartyProfile
      </div>
      <button type="button">Change House layout</button>
      <button type="button">Change Party Settings</button>

    </div>
  );
};

export default PartyProfile;
