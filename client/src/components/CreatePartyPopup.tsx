import React, { FC, ReactElement, useState, useEffect } from 'react';
import Popup from 'reactjs-popup';

interface CreatePartyPopupProps {
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  };
}

const CreatePartyPopup: FC<CreatePartyPopupProps> = ({
  user,
}): ReactElement => {
  const [partyDetails, setPartyDetails] = useState();

  useEffect(() => {
  });

  return (
    <Popup trigger={<button type="button" className="text-orange-100 bg-black p-1">Make a new party</button>} position="top left">
      {close => (
        // to do:  *************** make all this stuff responsive and sized well
        <div className="flex p-8">
          <button type="button" className="close absolute top-0 right-0" onClick={close}>
            &times;
          </button>
          <h4 className="absolute left-0 top-0 pl-2 pt-2">Create a Party</h4>
          <input className="flex max-w-full mt-4 border border-solid border-1" type="text" placeholder="Party Name?" />
          <button type="button" className="absolute bottom-0 my-2 border border-solid border-1 bg-blue-600 text-orange-300 px-2 max-w-full">Confirm party name</button>
        </div>
      )}
    </Popup>
  );
};

export default CreatePartyPopup;
