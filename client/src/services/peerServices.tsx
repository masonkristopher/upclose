import Peer from 'simple-peer';

const createPeer = (
  socket: SocketIOClient.Socket,
  userToSignal: string,
  callerID: string,
  stream: MediaStream,
): Peer.Instance => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });
  peer.on('signal', (signal: any) => {
    socket.emit('created peer signal', { userToSignal, callerID, signal });
  });
  peer.on('close', () => {
    console.log('peer destroyed (by non-initiator)', peer);
  });
  return peer;
};

const addPeer = (
  socket: SocketIOClient.Socket,
  incomingSignal: string,
  callerID: string,
  stream: MediaStream,
): Peer.Instance => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream,
  });
  peer.on('signal', (signal: any) => {
    socket.emit('returning signal', { signal, callerID });
  });
  peer.on('close', () => console.log('peer destroyed (by initiator)', peer));
  peer.signal(incomingSignal);
  return peer;
};

export {
  createPeer,
  addPeer,
};
