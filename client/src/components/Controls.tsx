/* eslint-disable no-param-reassign */
import React, { FC, ReactElement, useState } from 'react';

interface ControlPanelProps {
  userVideo: React.RefObject<HTMLVideoElement>,
}

const ControlPanel: FC<ControlPanelProps> = ({ userVideo }): ReactElement => {
  const [videoSwitchToggle, setVideoSwitchToggle] = useState(true);
  const [audioSwitchToggle, setAudioSwitchToggle] = useState(true);
  const { AudioContext } = window;
  const audioCtx = new AudioContext();
  const convolver = audioCtx.createConvolver();
  const biquadFilter = audioCtx.createBiquadFilter();
  const gainNode = audioCtx.createGain();
  let videoSwitch = videoSwitchToggle;
  let audioSwitch = audioSwitchToggle;

  const mute = () => {
    if (userVideo.current && userVideo.current.srcObject) {
      audioSwitch = !audioSwitch;
      setAudioSwitchToggle(!audioSwitchToggle);
      (userVideo.current.srcObject as MediaStream).getAudioTracks()[0].enabled = audioSwitch;
    }
  };

  const pauseVideo = () => {
    if (userVideo.current && userVideo.current.srcObject) {
      videoSwitch = !videoSwitch;
      setVideoSwitchToggle(!videoSwitchToggle);
      (userVideo.current.srcObject as MediaStream).getVideoTracks()[0].enabled = videoSwitch;
    }
  };

  const micSVG = () => {
    if (audioSwitchToggle) {
      return 'M 15 2 C 13.343 2 12 3.343 12 5 L 12 17 C 12 18.657 13.343 20 15 20 C 16.657 20 18 18.657 18 17 L 18 5 C 18 3.343 16.657 2 15 2 z M 8.984375 11.986328 A 1.0001 1.0001 0 0 0 8 13 L 8 17 C 8 20.513997 10.617426 23.430774 14 23.919922 L 14 26 L 11 26 A 1.0001 1.0001 0 1 0 11 28 L 14.832031 28 A 1.0001 1.0001 0 0 0 15.158203 28 L 19 28 A 1.0001 1.0001 0 1 0 19 26 L 16 26 L 16 23.919922 C 19.382574 23.430774 22 20.513997 22 17 L 22 13 A 1.0001 1.0001 0 1 0 20 13 L 20 17 C 20 19.735431 17.833516 21.933922 15.113281 21.994141 A 1.0001 1.0001 0 0 0 14.984375 21.986328 A 1.0001 1.0001 0 0 0 14.875 21.994141 C 12.16029 21.92784 10 19.731486 10 17 L 10 13 A 1.0001 1.0001 0 0 0 8.984375 11.986328 z';
    }
      return 'M 15 2 C 13.343 2 12 3.343 12 5 L 12 17 C 12 18.499 13.102063 19.730125 14.539062 19.953125 C 15.196063 18.130125 16.416 16.577578 18 15.517578 L 18 5 C 18 3.343 16.657 2 15 2 z M 9 12 C 8.448 12 8 12.447 8 13 L 8 17 C 8 20.519 10.613 23.431922 14 23.919922 L 14 26 L 11 26 C 10.448 26 10 26.447 10 27 C 10 27.553 10.448 28 11 28 L 15.517578 28 C 14.559578 26.57 14 24.851 14 23 C 14 22.629 14.028266 22.26525 14.072266 21.90625 C 11.758266 21.46925 10 19.439 10 17 L 10 13 C 10 12.447 9.552 12 9 12 z M 21 12 C 20.448 12 20 12.447 20 13 L 20 14.523438 C 20.638 14.297438 21.305 14.135594 22 14.058594 L 22 13 C 22 12.447 21.552 12 21 12 z M 23 16 C 19.14 16 16 19.14 16 23 C 16 26.86 19.14 30 23 30 C 26.86 30 30 26.86 30 23 C 30 19.14 26.86 16 23 16 z M 23 18 C 24.017 18 24.962906 18.308031 25.753906 18.832031 L 18.832031 25.753906 C 18.308031 24.962906 18 24.017 18 23 C 18 20.243 20.243 18 23 18 z M 27.167969 20.246094 C 27.691969 21.037094 28 21.983 28 23 C 28 25.757 25.757 28 23 28 C 21.983 28 21.037094 27.691969 20.246094 27.167969 L 27.167969 20.246094 z';
  };

  const vidSVG = () => {
    if (videoSwitchToggle) {
      return 'M 5 9 C 2.199219 9 0 11.199219 0 14 L 0 36 C 0 38.800781 2.199219 41 5 41 L 32 41 C 34.800781 41 37 38.800781 37 36 L 37 14 C 37 11.199219 34.800781 9 32 9 Z M 50 12.3125 L 39 18.1875 L 39 31.8125 L 50 37.6875 Z';
    } 
    return 'M 0.90625 -0.03125 C 0.863281 -0.0234375 0.820313 -0.0117188 0.78125 0 C 0.40625 0.0664063 0.105469 0.339844 0 0.703125 C -0.105469 1.070313 0.00390625 1.460938 0.28125 1.71875 L 48.28125 49.71875 C 48.679688 50.117188 49.320313 50.117188 49.71875 49.71875 C 50.117188 49.320313 50.117188 48.679688 49.71875 48.28125 L 37 35.5625 L 37 14 C 37 11.199219 34.800781 9 32 9 L 10.4375 9 L 1.71875 0.28125 C 1.511719 0.0585938 1.210938 -0.0546875 0.90625 -0.03125 Z M 5 9 C 2.300781 9 0 11.300781 0 14 L 0 36 C 0 38.800781 2.199219 41 5 41 L 32 41 C 33.398438 41 34.601563 40.394531 35.5 39.59375 Z M 50 12.3125 L 39 18.25 L 39 31.75 L 50 37.6875 Z';
  };

  const verb = () => {
    if (userVideo.current && userVideo.current.srcObject) {
      const source = audioCtx.createMediaStreamSource(userVideo.current.srcObject as MediaStream);
      // console.log('verbclicked', source);
      source.connect(audioCtx.destination);
      source.connect(convolver);
      convolver.connect(gainNode);
      gainNode.connect(biquadFilter);
      biquadFilter.connect(audioCtx.destination);
    }
  };

  return (
    <div className="justify-center mt-2 z-40">
      {/* Pause Video Button */}
      <button
        onClick={pauseVideo}
        type="button"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
      >
        <svg
          className="fill-current w-5 h-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
        >
          <path d={vidSVG()} />
        </svg>
      </button>
      {/* Mute Button */}
      <button
        onClick={mute}
        type="button"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
      >
        <svg
          className="fill-current w-5 h-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
        >
          <path d={micSVG()} />
        </svg>
      </button>
      {/* Effect control switches */}
      <button
        onClick={verb}
        type="button"
        className="bg-gray-300 flex space-x-4 hover:bg-gray-400 text-gray-600 font-bold py-1 px-4 rounded-r"
      >
        reverb
      </button>
      <button
        type="button"
        className="bg-gray-300 flex space-x-4 hover:bg-gray-400 text-gray-600 font-bold py-1 px-4 rounded-r"
      >
        pitch
        <svg xmlns="http://www.w3.org/2000/svg" className="fill-current" viewBox="0 0 24 24" width="24" height="24"><path d="M13 5.41V21a1 1 0 0 1-2 0V5.41l-5.3 5.3a1 1 0 1 1-1.4-1.42l7-7a1 1 0 0 1 1.4 0l7 7a1 1 0 1 1-1.4 1.42L13 5.4z" /></svg>
      </button>
      <button
        type="button"
        className="bg-gray-300 flex space-x-4 hover:bg-gray-400 text-gray-600 font-bold py-1 px-4 rounded-r"
      >
        pitch
        <svg xmlns="http://www.w3.org/2000/svg" className="fill-current" viewBox="0 0 24 24" width="24" height="24"><path d="M11 18.59V3a1 1 0 0 1 2 0v15.59l5.3-5.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-7-7a1 1 0 0 1 1.4-1.42l5.3 5.3z" /></svg>
      </button>
    </div>
  );
};

export default ControlPanel;
