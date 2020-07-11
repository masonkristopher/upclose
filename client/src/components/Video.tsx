import React, {
  FC, useState, ReactElement, useRef, useEffect,
} from 'react';

interface VideoProps {
  peer: any;
}

const Video: FC<VideoProps> = ({ peer }) => {

  const ref: any = useRef();

  useEffect(() => {
    peer.on('stream', (stream: any) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <div className="text-blue mt-4">
      <video ref={ref} playsInline autoPlay>
        <track></track>
      </video>
    </div>
  );
};

export default Video;
