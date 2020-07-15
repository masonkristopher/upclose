import React, {
  FC, useState, ReactElement, useRef, useEffect,
} from 'react';

interface VideoProps {
  peer: any;
}

const Video: FC<VideoProps> = ({ peer }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const audioCtx = new AudioContext();
  const gainNode = audioCtx.createGain();
  const [gain, setGain]: any = useState(1);

  useEffect(() => {
    peer.on('stream', (stream: any) => {
      if (ref.current !== null) {
        ref.current.srcObject = stream;
        // new WebAudio context
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      }
    });
  }, []);

  return (
    <div className="text-blue mt-4">
      <video ref={ref} playsInline autoPlay>
        <track />
      </video>
      <button type="button" className="bg-white hover:bg-pink-100 text-gray-800 font-semibold p-1 border border-gray-400 rounded shadow float-right" onClick={() => { gainNode.gain.setValueAtTime(0, audioCtx.currentTime); }}>WEBAUDIOMUTE</button>
      <button type="button" className="bg-white hover:bg-pink-100 text-gray-800 font-semibold p-1 border border-gray-400 rounded shadow float-right" onClick={() => { gainNode.gain.setValueAtTime(1, audioCtx.currentTime); }}>webaudioUNmute</button>
    </div>
  );
};

export default Video;
