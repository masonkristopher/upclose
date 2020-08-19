import React, { FC, ReactElement } from 'react';
import { CSSProperties } from 'styled-components';
import logo from '../assets/logo.png';

const backgroundStyle: CSSProperties = {
  backgroundImage: `url(${logo})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
};

const Landing: FC = (): ReactElement => {
  return (
    <div
      style={backgroundStyle}
      className="h-screen w-screen opacity-50"
    >
      <div
        className="text-lg relative top-1/2 mx-auto w-1/2"
      >
        <p>
          {/* eslint-disable-next-line max-len */}
          UpClose is a revolutionary video conferencing application that creates realistic social environments through positionally adjusted audio streaming. Start a party, and hang out in one big house with all your friends, while only hearing the ones closest to you. Instead of straining to be heard, simply navigate to another room in the house with your conversation partners. UpClose is the answer to socio-virtual gatherings of all kinds. Whether you’re hanging with friends, hosting a networking event, or even teaching a classroom, UpClose is the tool to help you hear and be heard.
        </p>
      </div>
    </div>
  );
};

export default Landing;
