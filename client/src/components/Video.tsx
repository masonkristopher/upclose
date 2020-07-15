import React, {
  FC, useState, ReactElement, useRef, useEffect,
} from 'react';

interface VideoProps {
  peer: any;
}

const Video: FC<VideoProps> = ({ peer }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer.on('stream', (stream: any) => {
      if (ref.current !== null) {
        ref.current.srcObject = stream;
        // new WebAudio context
        // do some shit to the stream here
      }
    });
  }, []);

  return (
    <div className="text-blue mt-4">
      <video ref={ref} playsInline autoPlay>
        <track />
      </video>
      {/* rendering some audio controls here */}
    </div>
  );
};

export default Video;
