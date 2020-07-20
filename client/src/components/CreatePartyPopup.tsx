import React, { FC, ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
import {
  CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image, DotGroup,
} from 'pure-react-carousel';
import cryptoRandomString from 'crypto-random-string';
import axios from 'axios';
import SearchPopup from './SearchPopup';
// to do: does this need to go somewhere else???
import 'pure-react-carousel/dist/react-carousel.es.css';

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
  // const [activeSlide, setActiveSlide] = useState(0);
  // this should equal how many layouts we have  **************
  // const [totalSlides, setTotalSlides] = useState(2);

  // sets partyDetails state to have the party's name
  const setPartyName = (e: any): void => {
    const copy = { ...partyDetails };
    copy.name = e.target.value;
    setPartyDetails(copy);
  };
  // // sets partyDetails state to have the party's layout
  // const setPartyLayout = (e: number): void => {
  //   const copy = { ...partyDetails };
  //   copy.idLayout = e;
  //   setPartyDetails(copy);
  // };
  // // sets the active slide when the back button is clicked
  // const handleBack = () => {
  //   setActiveSlide(activeSlide - 1);
  //   if (activeSlide <= 0) {
  //     setActiveSlide(0);
  //   }
  // };
  // // sets the active slide when the next button is clicked
  // const handleNext = () => {
  //   setActiveSlide(activeSlide + 1);
  //   if (activeSlide >= totalSlides - 1) {
  //     setActiveSlide(totalSlides);
  //   }
  // };

  const toggleChecked = () => {
    setIsChecked(!isChecked);
    const newPartyDetails = { ...partyDetails };
    newPartyDetails.inviteOnly = !newPartyDetails.inviteOnly;
    setPartyDetails(newPartyDetails);
  };

  // sends request to server to save the party, sending party details
  const saveParty = () => {
    console.log(cryptoRandomString({length: 150}));
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

/* <Popup open={popUpNumber === 2}>
        <>
          <h4 className="relative left-0 top-0 pl-2 pt-2 font-bold">Select a layout</h4>
          <CarouselProvider
            className="max-w-full max-h-full"
            naturalSlideWidth={100}
            naturalSlideHeight={125}
            totalSlides={totalSlides}
          >
            <Slider
              className="slider"
            >
              <Slide
                index={0}
              >
                <Image
                  hasMasterSpinner={false}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Cartesian_coordinates_2D.svg/1200px-Cartesian_coordinates_2D.svg.png"
                  className="max-w-full max-h-full"
                />
              </Slide>
              <Slide
                index={1}
              >
                <Image
                  hasMasterSpinner={false}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Cartesian_coordinates_2D.svg/1200px-Cartesian_coordinates_2D.svg.png"
                  className="max-w-full max-h-full"
                />
              </Slide>
            </Slider>
            <DotGroup />
            <ButtonBack
              onClick={handleBack}
            >
              Back
            </ButtonBack>
            <ButtonNext
              onClick={handleNext}
            >
              Next
            </ButtonNext>
          </CarouselProvider>
          <button type="button" className="relative bottom-0 border border-solid border-1 bg-blue-600 text-orange-300" onClick={() => { setPartyLayout(activeSlide); setPopupNumber(3); }}>Confirm party layout</button>
        </>
      </Popup>
*/
