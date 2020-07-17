/* eslint-disable no-param-reassign */
import React, { FC, ReactElement } from 'react';

interface ControlPanelProps {
  userVideo: React.RefObject<HTMLVideoElement>,
}

const ControlPanel: FC<ControlPanelProps> = ({ userVideo }): ReactElement => {
  let videoSwitch = true;
  let audioSwitch = true;

  const mute = () => {
    if (userVideo.current && userVideo.current.srcObject) {
      audioSwitch = !audioSwitch;
      (userVideo.current.srcObject as MediaStream).getAudioTracks()[0].enabled = audioSwitch;
    }
  };

  const pauseVideo = () => {
    if (userVideo.current && userVideo.current.srcObject) {
      videoSwitch = !videoSwitch;
      (userVideo.current.srcObject as MediaStream).getVideoTracks()[0].enabled = videoSwitch;
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
          className="fill-current w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M17.919,4.633l-3.833,2.48V6.371c0-1-0.815-1.815-1.816-1.815H3.191c-1.001,0-1.816,0.814-1.816,1.815v7.261c0,1.001,0.815,1.815,1.816,1.815h9.079c1.001,0,1.816-0.814,1.816-1.815v-0.739l3.833,2.478c0.428,0.226,0.706-0.157,0.706-0.377V5.01C18.625,4.787,18.374,4.378,17.919,4.633 M13.178,13.632c0,0.501-0.406,0.907-0.908,0.907H3.191c-0.501,0-0.908-0.406-0.908-0.907V6.371c0-0.501,0.407-0.907,0.908-0.907h9.079c0.502,0,0.908,0.406,0.908,0.907V13.632zM17.717,14.158l-3.631-2.348V8.193l3.631-2.348V14.158z" />
        </svg>
      </button>
      {/* Mute Button */}
      <button
        onClick={mute}
        type="button"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
      >
        <svg
          className="fill-current w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10.403,15.231v2.035h2.827c0.223,0,0.403,0.181,0.403,0.404c0,0.223-0.181,0.403-0.403,0.403H6.77c-0.223,0-0.404-0.181-0.404-0.403c0-0.224,0.181-0.404,0.404-0.404h2.826v-2.035C6.89,15.024,4.751,12.758,4.751,10c0-0.223,0.181-0.403,0.404-0.403S5.559,9.777,5.559,10c0,2.449,1.992,4.441,4.441,4.441c2.449,0,4.441-1.992,4.441-4.441c0-0.223,0.182-0.403,0.404-0.403s0.403,0.18,0.403,0.403C15.248,12.758,13.108,15.024,10.403,15.231 M13.026,4.953V10c0,1.669-1.357,3.027-3.027,3.027S6.972,11.669,6.972,10V4.953c0-1.669,1.358-3.028,3.028-3.028S13.026,3.284,13.026,4.953M12.221,4.953c0-1.225-0.996-2.22-2.221-2.22s-2.221,0.995-2.221,2.22V10c0,1.225,0.996,2.22,2.221,2.22s2.221-0.995,2.221-2.22V4.953z" />
        </svg>
      </button>
    </div>
  );
};

export default ControlPanel;
