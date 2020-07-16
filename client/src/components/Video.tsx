import React, {
  FC, useState, ReactElement, useRef, useEffect,
} from 'react';

interface VideoProps {
  peer: any;
  positionA: any;
  positionB: any;
}

const Video: FC<VideoProps> = ({ peer, positionA, positionB }) => {
  const ref: any = useRef<HTMLVideoElement>(null);

  const getDistance = (a: any, b: any) => {
    if (a !== null && a !== undefined) {
      return Math.sqrt((a.left - b.left) * (a.left - b.left) + (a.top - b.top) * (a.top - b.top));
    }
    // (a.left - b.left) * (a.left - b.left) + (a.top - b.top) * (a.top - b.top)
    // left = x
    // top = y
  };

  const setVolume = (distance: any) => {
    let volume;
    switch (true) {
      case (distance >= 400):
        volume = 0;
        break;
      case (distance >= 360):
        volume = 0.1;
        break;
      case (distance >= 320):
        volume = 0.2;
        break;
      case (distance >= 280):
        volume = 0.3;
        break;
      case (distance >= 240):
        volume = 0.4;
        break;
      case (distance >= 200):
        volume = 0.5;
        break;
      case (distance >= 160):
        volume = 0.6;
        break;
      case (distance >= 120):
        volume = 0.7;
        break;
      case (distance >= 80):
        volume = 0.8;
        break;
      case (distance >= 40):
        volume = 0.9;
        break;
      case (distance >= 0):
        volume = 1.0;
        break;
      default:
        volume = 0;
        break;
    }
    ref.current.volume = volume;
  };

  useEffect(() => {
    peer.on('stream', (stream: any) => {
      if (ref.current !== null) {
        ref.current.srcObject = stream;
        setVolume(getDistance(positionA, positionB));
        console.log(ref.current.volume);
      }
    });
  }, []);

  useEffect(() => {
    setVolume(getDistance(positionA, positionB));
    console.log('This is your current volume:', ref.current.volume);
  }, [positionA]);

  // const setGain = (num: number) => {
  //   ref.current.volume = num;
  // };

  return (
    <div className="text-blue mt-4">
      <video ref={ref} playsInline autoPlay>
        <track />
      </video>
      {/* <button type="button" className="bg-white hover:bg-pink-100 text-gray-800 font-semibold p-1 border border-gray-400 rounded shadow float-right" onClick={() => { setGain(0); }}>WEBAUDIOMUTE</button>
      <button type="button" className="bg-white hover:bg-pink-100 text-gray-800 font-semibold p-1 border border-gray-400 rounded shadow float-right" onClick={() => { setGain(1); }}>webaudioUNmute</button> */}
    </div>
  );
};

export default Video;
