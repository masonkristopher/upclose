import React, { FC, ReactElement } from 'react';
import { CSSProperties } from 'styled-components';
import logo from '../assets/transparentLogo.png';

const backgroundStyle: CSSProperties = {
  backgroundImage: `url(${logo})`,
  backgroundPosition: 'center top',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
};

const Landing: FC = (): ReactElement => {
  return (
    <div
      className="h-screen w-screen"
    >
      <div
        className="text-lg relative mt-16 mx-auto w-1/2"
      >
        <h1 className="font-bold text-xl text-seaweed mb-4">
          UpClose is a revolutionary video conferencing application that creates realistic social environments through positionally adjusted audio streaming.
        </h1>
        <p className="mb-4">
          {/* eslint-disable-next-line max-len */}
          Start a party, and hang out in one big house with all your friends, while only hearing the ones closest to you. Instead of straining to be heard, simply navigate to another room in the house with your conversation partners.
        </p>
        <p className="mb-4">
          {/* eslint-disable-next-line max-len */}
          UpClose is the answer to socio-virtual gatherings of all kinds. Whether you’re hanging with friends, hosting a networking event, or even teaching a classroom, UpClose is the tool to help you hear and be heard.
        </p>
        <div className="flex flex-row flex-wrap">
          <svg className={`h-landing w-landing fill-current text-salmon m-10`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path xmlns="http://www.w3.org/2000/svg" d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" />
          </svg>
          <svg className={`h-landing w-landing fill-current text-avocado m-10`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path xmlns="http://www.w3.org/2000/svg" d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" />
          </svg>
          <svg className={`h-landing w-landing fill-current text-caviar m-10`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path xmlns="http://www.w3.org/2000/svg" d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Landing;
