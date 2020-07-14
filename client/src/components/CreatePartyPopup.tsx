import React, { FC, ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image, DotGroup } from 'pure-react-carousel';
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
  });
  const [invitees, setInvitees]: any = useState([]);
  const [popUp, setPopup]: any = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  // this should equal how many layouts we have  **************
  const [totalSlides, setTotalSlides] = useState(2);
  // useHistory allows us to redirect by pushing onto the url
  const history = useHistory();

  // sets partyDetails state to have the party's name
  const setPartyName = (e: any): void => {
    const copy = { ...partyDetails };
    copy.name = e.target.value;
    setPartyDetails(copy);
  };
  // sets partyDetails state to have the party's layout
  const setPartyLayout = (e: number): void => {
    const copy = { ...partyDetails };
    copy.idLayout = e;
    setPartyDetails(copy);
  };
  // sets the active slide when the back button is clicked
  const handleBack = () => {
    setActiveSlide(activeSlide - 1);
    if (activeSlide <= 0) {
      setActiveSlide(0);
    }
  };
  // sets the active slide when the next button is clicked
  const handleNext = () => {
    setActiveSlide(activeSlide + 1);
    if (activeSlide >= totalSlides - 1) {
      setActiveSlide(totalSlides);
    }
  };
  // sends request to server to save the party, sending party details
  const saveParty = () => {
    axios.post('/party/create', {
      ...partyDetails,
    })
      .then((response) => {
        // party's id
        const { id } = response.data;
        // add logged in user to UserParty join table
        axios.post(`user/${user.id}/joins/${id}`);
        // map through invitees and use their userId + id to add them to UserParty table
        invitees.map((invitee: any) => {
          axios.post(`user/${invitee.id}/joins/${id}`);
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
      <Popup trigger={<button type="button" className="text-orange-100 bg-black p-1">Make a new party</button>} position="top left">
        {close => (
          // to do:  *************** make all this stuff responsive and sized well
          <div className="flex p-8">
            <button type="button" className="close absolute top-0 right-0" onClick={() => { close(); setPopup(0); setInvitees([]); }}>
              &times;
            </button>
            {popUp === 0 && (
              <>
                <h4 className="absolute left-0 top-0 pl-2 pt-2">Create a Party</h4>
                <input onChange={setPartyName} className="flex max-w-full mt-4 border border-solid border-1" type="text" placeholder="Party Name?" />
                <button type="button" className="absolute bottom-0 my-2 border border-solid border-1 bg-blue-600 text-orange-300 px-2 max-w-full" onClick={() => { setPopup(1); }}>Confirm party name</button>
              </>
            )}
            {popUp === 1 && (
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
                <button type="button" className="relative bottom-0 border border-solid border-1 bg-blue-600 text-orange-300" onClick={() => { setPartyLayout(activeSlide); setPopup(2); }}>Confirm party layout</button>
              </>
            )}
            {popUp === 2 && (
              <>
                <div>
                  <h4 className="relative pb-1 left-0 top-0 font-bold">Invite people</h4>
                  <SearchPopup
                    user={user}
                    setInvitees={setInvitees}
                  />
                  <button type="button" className="relative bottom-0 my-2 border border-solid border-1 bg-blue-600 text-orange-300 px-2 max-w-full" onClick={() => { saveParty(); setPopup(0); }}>Confirm Invites</button>
                </div>
              </>
            )}
          </div>
        )}
      </Popup>
    </>
  );
};

export default CreatePartyPopup;
