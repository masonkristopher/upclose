import React, { FC, ReactElement, useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image, DotGroup } from 'pure-react-carousel';
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
  // in this useState, should I make an interface of this object instead?
  const [partyDetails, setPartyDetails] = useState({
    partyName: '',
    layout: 0,
    guests: [],
  });
  const [popUp, setPopup] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  // this should equal how many layouts we have
  const [totalSlides, setTotalSlides] = useState(2);

  useEffect(() => {
  });

  const setPartyName = (e: any): void => {
    const copy = { ...partyDetails };
    copy.partyName = e.target.value;
    setPartyDetails(copy);
  };

  const setPartyLayout = (e: number): void => {
    const copy = { ...partyDetails };
    copy.layout = e;
    setPartyDetails(copy);
  };

  const handleBack = () => {
    setActiveSlide(activeSlide - 1);
    if (activeSlide <= 0) {
      setActiveSlide(0);
    }
  };

  const handleNext = () => {
    setActiveSlide(activeSlide + 1);
    if (activeSlide >= totalSlides - 1) {
      setActiveSlide(totalSlides);
    }
  };

  return (
    <>
      {popUp === 0 && (
        <Popup trigger={<button type="button" className="text-orange-100 bg-black p-1">Make a new party</button>} position="top left">
          {close => (
            // to do:  *************** make all this stuff responsive and sized well
            <div className="flex p-8">
              <button type="button" className="close absolute top-0 right-0" onClick={() => { close(); setPopup(0); }}>
                &times;
              </button>
              <h4 className="absolute left-0 top-0 pl-2 pt-2">Create a Party</h4>
              <input onChange={setPartyName} className="flex max-w-full mt-4 border border-solid border-1" type="text" placeholder="Party Name?" />
              <button type="button" className="absolute bottom-0 my-2 border border-solid border-1 bg-blue-600 text-orange-300 px-2 max-w-full" onClick={() => { close(); setPopup(1); }}>Confirm party name</button>
            </div>
          )}
        </Popup>
      )}
      {popUp === 1 && (
        <div className="flex p-8 bg-indigo-300">
          <button type="button" className="close absolute top-0 right-0" onClick={() => { setPopup(0); }}>
            &times;
          </button>

          <h4 className="absolute left-0 top-0 pl-2 pt-2 font-bold">Select a layout</h4>
          <CarouselProvider
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
          <button type="button" className="absolute bottom-0 my-2 border border-solid border-1 bg-blue-600 text-orange-300 px-2 max-w-full" onClick={() => { setPartyLayout(activeSlide); setPopup(2) }}>Confirm party layout</button>

        </div>
      )}
      {popUp === 2 && (
        // this popup will be replace with component for inviting people
        <div className="flex p-8 bg-indigo-300">
          <button type="button" className="close absolute top-0 right-0" onClick={() => { setPopup(0); }}>
            &times;
          </button>
          <div>
            <h4 className="absolute left-0 top-0 pl-2 pt-2 font-bold">Invite people</h4>
            <p> Let us put an invite componnent here</p>
            <button type="button" className="absolute bottom-0 my-2 border border-solid border-1 bg-blue-600 text-orange-300 px-2 max-w-full" onClick={() => { setPopup(0); }}>Confirm party layout</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePartyPopup;
