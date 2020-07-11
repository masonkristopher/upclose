import React, { FC, ReactElement, useState, useEffect, useRef, useLayoutEffect } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

import House from './House';
import VideoList from './VideoList';
import Video from './Video';
import ChatFeed from './ChatFeed';
import ChatSend from './ChatSend';

interface HousePartyProps {
  partyName: string;
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  };
}

const HouseParty: FC<HousePartyProps> = ({
  partyName,
  user,
}): ReactElement => {
  const [roomID, setRoomID] = useState('red');
  const [peers, setPeers]: any = useState([]);
  const socketRef: any = useRef();
  const userVideo: any = useRef();
  const peersRef: any = useRef([]);
  // const roomID = 1;
  let videoSwitch = true;
  let audioSwitch = true;

  const videoConstraints: MediaTrackConstraints = {
    width: 320,
    height: 180,
  };

  function createPeer(userToSignal: any, callerID: any, stream: any) {
    const peer: any = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal: any) => {
      socketRef.current.emit('sending signal', { userToSignal, callerID, signal });
    });
    console.log('create peer: ', peer);
    return peer;
  }

  function addPeer(incomingSignal: any, callerID: any, stream: any) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketRef.current.emit('returning signal', { signal, callerID });
    });

    peer.signal(incomingSignal);
    console.log('add peer: ', peer);
    return peer;
  }

  function socketConnect() {
    socketRef.current = io.connect('/');
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;
      socketRef.current.emit('join room', roomID);
      console.log('****join room emit****', roomID);
      socketRef.current.on('all users', (users: any) => {
        const peersArray: any = [];
        users.forEach((userID: any) => {
          const peer: any = createPeer(userID, socketRef.current.id, stream);
          peersRef.current.push({
            peerID: userID,
            peer,
          });
          peersArray.push(peer);
        });
        setPeers(peersArray);
      });

      socketRef.current.on('user joined', (payload: any) => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });

        setPeers((users: any) => [...users, peer]);
      });

      socketRef.current.on('receiving returned signal', (payload: any) => {
        const item = peersRef.current.find((p: any) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
    });
  }

  function pauseVideo() {
    if (userVideo.current.srcObject) {
      videoSwitch = !videoSwitch;
      userVideo.current.srcObject.getVideoTracks()[0].enabled = videoSwitch;
    }
  }

  function mute() {
    if (userVideo.current.srcObject) {
      audioSwitch = !audioSwitch;
      userVideo.current.srcObject.getAudioTracks()[0].enabled = audioSwitch;
    }
  }

  // useLayoutEffect(() => {
  //   socketConnect();
  //   console.log('HouseParty useLayoutEffect ran');
  // }, [roomID]);

  useEffect(() => {
    socketConnect();
    // console.log('HouseParty useEffect ran');
  }, []);

  return (
    <div className="container p-4">
      {/* Header */}
      <div className="px-4">
        {`Party Name: ${partyName} ${roomID}`}
      </div>
      {/* House */}
      <div className="px-4 float-left">
        <div className="">
          <House user={user} setRoomID={setRoomID} />
        </div>
      </div>

      {/* Right=Side Video Side Panel */}
      <div className="bg-gray-500 p-4 float-left m-6">
        {/* Your Video */}
        <div className="z-10">
          <video muted autoPlay ref={userVideo} className="mb-3 shadow-md z-0" />
        </div>

        {/* mute video/mic buttons */}
        <div className="justify-center mt-2 z-40">
          <button onClick={pauseVideo} type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M17.919,4.633l-3.833,2.48V6.371c0-1-0.815-1.815-1.816-1.815H3.191c-1.001,0-1.816,0.814-1.816,1.815v7.261c0,1.001,0.815,1.815,1.816,1.815h9.079c1.001,0,1.816-0.814,1.816-1.815v-0.739l3.833,2.478c0.428,0.226,0.706-0.157,0.706-0.377V5.01C18.625,4.787,18.374,4.378,17.919,4.633 M13.178,13.632c0,0.501-0.406,0.907-0.908,0.907H3.191c-0.501,0-0.908-0.406-0.908-0.907V6.371c0-0.501,0.407-0.907,0.908-0.907h9.079c0.502,0,0.908,0.406,0.908,0.907V13.632zM17.717,14.158l-3.631-2.348V8.193l3.631-2.348V14.158z" />
            </svg>
          </button>
          <button onClick={mute} type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M10.403,15.231v2.035h2.827c0.223,0,0.403,0.181,0.403,0.404c0,0.223-0.181,0.403-0.403,0.403H6.77c-0.223,0-0.404-0.181-0.404-0.403c0-0.224,0.181-0.404,0.404-0.404h2.826v-2.035C6.89,15.024,4.751,12.758,4.751,10c0-0.223,0.181-0.403,0.404-0.403S5.559,9.777,5.559,10c0,2.449,1.992,4.441,4.441,4.441c2.449,0,4.441-1.992,4.441-4.441c0-0.223,0.182-0.403,0.404-0.403s0.403,0.18,0.403,0.403C15.248,12.758,13.108,15.024,10.403,15.231 M13.026,4.953V10c0,1.669-1.357,3.027-3.027,3.027S6.972,11.669,6.972,10V4.953c0-1.669,1.358-3.028,3.028-3.028S13.026,3.284,13.026,4.953M12.221,4.953c0-1.225-0.996-2.22-2.221-2.22s-2.221,0.995-2.221,2.22V10c0,1.225,0.996,2.22,2.221,2.22s2.221-0.995,2.221-2.22V4.953z" />
            </svg>
          </button>
        </div>

        {/* Other Videos */}
        <div className="mt-6">
          {peers.map((peer: any) => {
            const { userID }: any = peer;
            return (
              <Video key={userID} peer={peer} />
            );
          })}
        </div>
      </div>

      {/* Underneath Chat Feature */}
      <div className="float-left m-6">
        <ChatSend key={user.id} user={user} partyName={partyName} />
      </div>
    </div>
  );
};

export default HouseParty;
