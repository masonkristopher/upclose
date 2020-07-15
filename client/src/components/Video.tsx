import React, {
  FC, useState, ReactElement, useRef, useEffect,
} from 'react';

interface VideoProps {
  peer: any;
}

const Video: FC<VideoProps> = ({ peer }) => {
  // const ref = useRef<HTMLVideoElement>(null);
  const [gain, setGain] = useState(0);
  const ref: any = useRef();
  const audioCtx = new AudioContext();
  const gainNode = audioCtx.createGain();

  useEffect(() => {
    peer.on('stream', (stream: any) => {
      if (ref.current !== null) {
        ref.current.srcObject = stream;
        const track = ref.current.srcObject.getAudioTracks()[0];
        // track.enabled = false;
        console.log(track);
        // new WebAudio context
        const source = audioCtx.createMediaStreamSource(stream);
        gainNode.connect(audioCtx.destination);
        source.connect(gainNode);
        // gainNode.gain.linearRampToValueAtTime(0, 0);
        gainNode.gain.value = gain;
        console.log(gainNode.gain.value);
      }
    });
  }, [gain]);

  // const setGain = (num: number) => {
  //   gainNode.gain.value = ;
  //   // gainNode.gain.linearRampToValueAtTime(num, 0);
  //   console.log('set gain clicked!', gainNode.gain.value);
  // };

  return (
    <div className="text-blue mt-4">
      <video ref={ref} playsInline autoPlay>
        <track />
      </video>
      <button type="button" className="bg-white hover:bg-pink-100 text-gray-800 font-semibold p-1 border border-gray-400 rounded shadow float-right" onClick={() => { setGain(0); }}>WEBAUDIOMUTE</button>
      <button type="button" className="bg-white hover:bg-pink-100 text-gray-800 font-semibold p-1 border border-gray-400 rounded shadow float-right" onClick={() => { setGain(1); }}>webaudioUNmute</button>
    </div>
  );
};

export default Video;
