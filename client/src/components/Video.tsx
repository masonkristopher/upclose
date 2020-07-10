import React, {
  FC, useState, ReactElement, useRef,
} from 'react';

interface VideoProps {
  userVideo: any;
}

const Video: FC<VideoProps> = ({ userVideo }) => {
  return (
    <div className="text-blue">
      <video ref={userVideo} playsInline autoPlay>
        <track></track>
      </video>
    </div>
  );
};

export default Video;
