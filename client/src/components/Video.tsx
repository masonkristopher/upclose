import React, {
  FC, useState, ReactElement, useRef, useEffect,
} from 'react';

interface VideoProps {
  peer: any;
  positionA: any;
  positionB: any;
  id: any;
}

const Video: FC<VideoProps> = ({
  peer,
  positionA,
  positionB,
  id,
}) => {
  const ref: any = useRef<HTMLVideoElement>(null);
  const [showVolume, setShowVolume]: any = useState(0);

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
    setShowVolume(volume);
  };

  useEffect(() => {
    peer.on('stream', (stream: any) => {
      if (ref.current !== null) {
        ref.current.srcObject = stream;
      }
    });
  }, []);

  useEffect(() => {
    setVolume(getDistance(positionA, positionB));
    console.log('positionA', id, ref.current.volume);
  }, [positionA]);

  useEffect(() => {
    setVolume(getDistance(positionA, positionB));
    console.log('positionB', id, ref.current.volume);
  }, [positionB]);

  // const setGain = (num: number) => {
  //   ref.current.volume = num;
  // };

  return (
    <div className="text-blue mt-4">
      <video ref={ref} playsInline autoPlay>
        <track />
      </video>
      user volume:
      { (showVolume * 100) }
      %
    </div>
  );
};

export default Video;
