import React, {
  useEffect,
  useRef,
  useState,
  FunctionComponent,
} from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props: any) => {
  const ref: any = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream: any) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <StyledVideo playsInline autoPlay ref={ref} />
  );
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const ChatRoom: FunctionComponent = ({ match }: any) => {
  const [peers, setPeers]: any = useState([]);
  const socketRef: any = useRef();
  const userVideo: any = useRef();
  const peersRef: any = useRef([]);
  const { roomID } = match.params;
  // const roomID = 1;

  function createPeer(userToSignal: any, callerID: any, stream: any) {
    const peer: any = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal: any) => {
      socketRef.current.emit('sending signal', { userToSignal, callerID, signal });
    });
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

    return peer;
  }

  useEffect(() => {
    socketRef.current = io.connect('/');
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;
      socketRef.current.emit('join room', roomID);
      socketRef.current.on('all users', (users: any) => {
        // const peers: any = [];
        users.forEach((userID: any) => {
          const peer: any = createPeer(userID, socketRef.current.id, stream);
          peersRef.current.push({
            peerID: userID,
            peer,
          });
          peers.push(peer);
        });
        setPeers(peers);
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
  }, []);

  return (
    <Container>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer: any, index: any) => {
        const { userID }: any = peer;
        return (
          <Video key={index} peer={peer} />
        );
      })}
    </Container>
  );
};

export default ChatRoom;
