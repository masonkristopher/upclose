import React, { FC, ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
import cryptoRandomString from 'crypto-random-string';
import axios from 'axios';
import { User } from '../services/constants';
import SearchPopup from './SearchPopup';

interface CreatePartyPopupProps {
  user: User,
}

const CreatePartyPopup: FC<CreatePartyPopupProps> = ({
  user,
}): ReactElement => {
  // to do:  in this useState, should I make an interface of this object instead?
  const [partyDetails, setPartyDetails] = useState({
    name: '',
    idLayout: 0,
    idCreator: user.id,
    inviteOnly: true,
    idRoomOne: '',
    idRoomTwo: '',
    idRoomThree: '',
    idRoomFour: '',
  });
  const [invitees, setInvitees]: any = useState([]);
  const [popUpNumber, setPopupNumber]: any = useState(0);
  const [isChecked, setIsChecked] = useState(true);
  // useHistory allows us to redirect by pushing onto the url
  const history = useHistory();

  // sets partyDetails state to have the party's name
  const setPartyName = (e: any): void => {
    const copy = { ...partyDetails };
    copy.name = e.target.value;
    setPartyDetails(copy);
  };

  const toggleChecked = () => {
    setIsChecked(!isChecked);
    const newPartyDetails = { ...partyDetails };
    newPartyDetails.inviteOnly = !newPartyDetails.inviteOnly;
    setPartyDetails(newPartyDetails);
  };

  // sends request to server to save the party, sending party details
  const saveParty = () => {
    partyDetails.idRoomOne = cryptoRandomString({length: 10});
    partyDetails.idRoomTwo = cryptoRandomString({length: 10});
    partyDetails.idRoomThree = cryptoRandomString({length: 10});
    partyDetails.idRoomFour = cryptoRandomString({length: 10});
    axios.post('/party/create', {
      ...partyDetails,
    })
      .then((response) => {
        // party's id
        const { id } = response.data;
        // add logged in user to UserParty join table
        axios.post(`user/${user.id}/joins/${id}`, {
          inviteStatus: 'accepted',
        });
        // map through invitees and use their userId + id to add them to UserParty table
        invitees.map((invitee: any) => {
          axios.post(`user/${invitee.id}/joins/${id}`, {
            inviteStatus: 'pending',
          });
        });
        return id;
      })
      .then((id) => {
        // redirect to party profile page
        history.push(`/partyProfile/${id}`);
      });
  };

  return (
    <>
      {/* Start a Party - Open Popup Button */}
      <button type="button" onClick={() => { setPopupNumber(0); setPopupNumber(1); }} className="bg-white hover:text-salmon text-gray-800 py-1 px-2 font-semibold border border-gray-400 rounded-full shadow">Start a Party</button>

      {/* Start a Party - Popup 1 */}
      <Popup onClose={() => { setInvitees([]); }} open={popUpNumber === 1}>
        <>
          <div className="justify-center text-seaweed items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-10/12 sm:w-10/12 md:w-2/3 lg:w-1/2 xl:w-1/2 my-6 mx-auto max-w-3xl">
              {/* content */}
              <div className="border-0 rounded-lg shadow-lg relative p-8 flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl text-seaweed font-semibold">
                    Create a Party
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => { setPopupNumber(0); setInvitees([]); }}
                    type="button"
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none hover:shadow-md">
                      ×
                    </span>
                  </button>
                </div>
                {/* body */}
                <div className="relative p-6 flex-auto">
                  <label htmlFor="party-name" className="block">
                    <span className="text-lg font-bold">Party Name</span>
                    <input onChange={setPartyName} className="form-input mt-1 block w-full" id="party-name" placeholder="My Party" />
                  </label>
                  <div className="mt-4">
                    <div className="mt-2">
                      <label htmlFor="invite-only" className="inline-flex items-center">
                        <input type="radio" className="form-radio text-avocado" name="accountType" value="invite" id="invite-only" checked={isChecked} onChange={toggleChecked} />
                        <span className="ml-2">Invite Only</span>
                      </label>
                      <label htmlFor="pubic" className="inline-flex items-center ml-6">
                        <input type="radio" className="form-radio text-caviar" name="accountType" value="public" id="public" checked={!isChecked} onChange={toggleChecked} />
                        <span className="ml-2">Public</span>
                      </label>
                    </div>
                  </div>
                </div>
                {/* footer */}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="text-caviar background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: 'all .15s ease' }}
                    onClick={() => { setPopupNumber(0); setInvitees([]); }}
                  >
                    Close
                  </button>

                  {/* prevent <next> button click unless party name is entered */}
                  {partyDetails.name === '' && (
                    <button
                      className="bg-gray-400 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 cursor-not-allowed"
                      type="button"
                      style={{ transition: 'all .15s ease' }}
                    >
                      Next
                    </button>
                  )}
                  {partyDetails.name !== '' && (
                    <button
                      className="bg-avocado text-white active:bg-salmon font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: 'all .15s ease' }}
                      onClick={() => { setPopupNumber(2); }}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      </Popup>

      {/* Invite Friends - Popup 2 */}
      <Popup
        open={popUpNumber === 2}
        onClose={() => { setInvitees([]); }}
      >
        <>
          <div className="justify-center text-seaweed items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-10/12 sm:w-10/12 md:w-2/3 lg:w-1/2 xl:w-1/2 my-6 mx-auto max-w-3xl">
              {/* content */}
              <div className="border-0 rounded-lg shadow-lg relative p-8 flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl text-seaweed font-semibold">
                    Invite Friends
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => { setPopupNumber(0); setInvitees([]); }}
                    type="button"
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none hover:shadow-md">
                      ×
                    </span>
                  </button>
                </div>
                <SearchPopup
                  user={user}
                  setInvitees={setInvitees}
                  saveParty={saveParty}
                  setPopupNumber={setPopupNumber}
                />
                {/* footer */}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="text-caviar background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: 'all .15s ease' }}
                    onClick={() => { setPopupNumber(1); }}
                  >
                    Back
                  </button>
                  <button
                    className="bg-avocado text-white active:bg-salmon font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: 'all .15s ease' }}
                    onClick={() => { saveParty(); setPopupNumber(0); }}
                  >
                    Save Party
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      </Popup>
    </>
  );
};

export default CreatePartyPopup;
