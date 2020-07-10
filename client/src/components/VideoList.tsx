import React, {
  FC, useState, ReactElement, useRef,
} from 'react';

interface VideoListProps {
  peers: any;
}

const VideoList: FC<VideoListProps> = ({ peers }) => {
  return (
    <div className="text-blue">
      {/*
        not sure which way will best to bring in peer's videos:

        <video autoPlay playsInLine ref={userVideo} />
        <Video userVideo={userVideo} />
      */}
      <div className="border border-black text-center p-4 mb-2 shadow-md">
        <p>peer 1&apos;s video stream</p>
      </div>
      <div className="border border-black text-center p-4 mb-2 shadow-md">
        <p>peer 2&apos;s video stream</p>
      </div>
      <div className="border border-black text-center p-4 mb-2 shadow-md">
        <p>peer 3&apos;s video stream</p>
      </div>
    </div>
  );
};

export default VideoList;
