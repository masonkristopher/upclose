import React, {
  FC, useState, ReactElement, useRef, useEffect,
} from 'react';

import Peer from 'simple-peer';

import { Position, Positions } from '../services/constants';

interface VideoProps {
  peer: Peer.Instance;
  positionA: Position;
  positionB: Position;
  id: string;
  positions: Positions;
}

const Video: FC<VideoProps> = ({
  peer,
  positionA,
  positionB,
  positions,
  id,
}): ReactElement => {
  const ref: any = useRef<HTMLVideoElement>(null);
  const [showVolume, setShowVolume]: any = useState(0);

  const getDistance = (a: any, b: any) => {
    if (a !== null && a !== undefined) {
      return Math.sqrt((a.left - b.left) * (a.left - b.left) + (a.top - b.top) * (a.top - b.top));
    }
  };

  const setVolume = (distance: any) => {
    let volume = 1;
    if (distance >= 400) {
      volume = 0;
    } else if (distance < 50) {
      volume = 1;
    } else {
      volume *= 1 - ((distance - 50) / 400);
    }
    console.log(volume);
    if (volume >= 0 && volume <= 1) {
      ref.current.volume = volume;
      setShowVolume(volume);
    }
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
  }, [positions]);

  return (
    <div className="text-blue">
      <video ref={ref} playsInline autoPlay>
        <track />
      </video>
      user volume:
      { Math.round(showVolume * 100) }
      %
    </div>
  );
};

export default Video;
