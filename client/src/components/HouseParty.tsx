import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
  useRef,
} from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { House, Video, ChatSend } from '.';
import { User, videoConstraints } from '../services/constants';
import { addPeer, createPeer } from '../services/peerServices';

const socket = io.connect('/');

interface HousePartyProps {
  user: User;
}

// this component will be rendered from the Navbar, via a link in the PartyProfile page
// its route will be /party/partyId
const HouseParty: FC<HousePartyProps> = ({
  user,
}): ReactElement => {
  // access the partyId from the route using useParams.
  const { partyId }: any = useParams();

  const [invited, setInvited]: any = useState(null);
  const [party, setParty]: any = useState({});
  const [users, setUsers]: any = useState([]);
  // const [peersCount, setPeersCount] = useState(0);

  const [roomID, setRoomID] = useState({ oldRoom: null, newRoom: 'red' });
  // const [others, setOthers]: any = useState([]); // [{ id, peer }]
  const [peers, setPeers]: any = useState({}); // { [socketId]: peer, [socketId]: peer... }

  const playerSocket = socket.id;

  const [positions, setPositions] = useState({
    [playerSocket]: {
      avatar: user.avatar,
      top: Math.random() * 500,
      left: Math.random() * 500,
    },
  });

  const userVideo = useRef<HTMLVideoElement>(null);

  let videoSwitch = true;
  let audioSwitch = true;

  const pauseVideo = () => {
    if (userVideo.current && userVideo.current.srcObject) {
      videoSwitch = !videoSwitch;
      (userVideo.current.srcObject as MediaStream).getVideoTracks()[0].enabled = videoSwitch;
    }
  };

  const mute = () => {
    if (userVideo.current && userVideo.current.srcObject) {
      audioSwitch = !audioSwitch;
      (userVideo.current.srcObject as MediaStream).getAudioTracks()[0].enabled = audioSwitch;
    }
  };

  const joinRoom = () => {
    socket.emit('join room', roomID.newRoom);
  };

  const switchRoom = () => {
    setPeers({});
    // setOthers([]);
    // setPeersCount(0);
    socket.emit('switch room', roomID.oldRoom, roomID.newRoom);
  };

  const joinParty = () => {
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true })
      .then(stream => {
        (userVideo.current as HTMLVideoElement).srcObject = stream;
        joinRoom();

        // remove user from peers
        socket.on('user left room', (leavingUserId: string, newRoomId: string) => {
          console.log(`user ${leavingUserId} left the room, removing from users`);
          if (roomID.newRoom !== newRoomId) {
            delete peers[leavingUserId];
            setPeers({ ...peers });

            // const othersWithoutUser = others.filter((other: any) => {
            //   return other.id !== leavingUserId;
            // });
            // setOthers(othersWithoutUser);
            // setPeersCount(peersCount - 1);
          }
        });

        // create new peer for new other users in room
        socket.on('user joined room', (joiningUserId: string) => {
          // const existingOthers = others;
          // let indexOfJoiningUser;
          // existingOthers.forEach((other: any, i: number) => {
          //   if (other.id === joiningUserId) {
          //     indexOfJoiningUser = i;
          //   }
          // });

          // if (indexOfJoiningUser !== undefined) {
          //   existingOthers.splice(indexOfJoiningUser, 1);
          // }
          if (joiningUserId !== socket.id) {
            const peer = createPeer(socket, joiningUserId, socket.id, stream);
            peers[joiningUserId] = peer;
            setPeers({ ...peers });

            // const other = {
            //   id: joiningUserId,
            //   peer: createPeer(socket, joiningUserId, socket.id, stream),
            // };
            // existingOthers.push(other);
            // setOthers(existingOthers);
            // setPeersCount(peersCount + 1);
          }
        });

        // add peer that is requesting connection
        socket.on('connection requested', (payload: any) => {
          const peer = addPeer(socket, payload.signal, payload.callerID, stream);
          peers[payload.callerID] = peer;
          setPeers({ ...peers });

          // const other = {
          //   id: payload.callerID,
          //   peer: addPeer(socket, payload.signal, payload.callerID, stream),
          // };
          // setOthers((others: any) => [...others, other]);
          // setPeersCount(peersCount + 1);
        });

        socket.on('receiving returned signal', (payload: any) => {
          if (peers[payload.id]) {
            peers[payload.id].signal(payload.signal);
          }
          // if (others.length) {
          //   const { peer } = others.find((other: any) => other.id === payload.id);
          //   peer.signal(payload.signal);
          // }
        });

        socket.on('user left party', (leavingUserId: string) => {
          delete peers[leavingUserId];
          setPeers({ ...peers });
          // const othersWithoutUser = others.filter((other: any) => {
          //   return other.id !== leavingUserId;
          // });
          // setOthers(othersWithoutUser);
          // setPeersCount(peersCount - 1);
        });

        socket.on('update player', (payload: any) => {
          const playerId = Object.keys(payload)[0];
          console.log('this player moved:', playerId);

          // const inSameRoom = others.findIndex((other: any) => other.id === playerId);
          if (peers[playerId]) {
            console.log(`player ${playerId} is in the same room... updating position`);
            positions[playerId] = payload[playerId];
            setPositions({ ...positions });
          } else {
            console.log(`player ${playerId} is not in same room... removing position`);
            delete positions[playerId];
            setPositions({ ...positions });
          }
        });
      });
  };

  // for debugging purposes only, logs when others is updated
  useEffect(() => {
    console.log('peers updated:', peers);
  }, [peers]);

  // // for debugging purposes only, logs when others is updated
  // useEffect(() => {
  //   console.log('others updated:', others);
  // }, [others]);

  // Runs once when HouseParty component initially renders
  useEffect(() => {
    if (roomID.oldRoom === null) {
      joinParty();
      console.log(`user ${socket.id} joined party`);
    }
    // should query the database and find the party we need on render
    axios.get(`/party/${partyId}`)
      .then((response) => {
        // then use setParty to put the party's info into state
        setParty(response.data);
        return axios.get(`/party/getUsers/${partyId}`);
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (roomID.oldRoom !== null) {
      console.log(`user: ${socket.id} switched from ${roomID.oldRoom} to ${roomID.newRoom}`);
      switchRoom();
    }
  }, [roomID]);

  // watches users for changes, then checks that the logged in user is an invited user
  useEffect(() => {
    users.forEach((invitedUser: any, index: number) => {
      if (invitedUser.id === user.id) {
        setInvited(true);
      } else if (index === users.length - 1) {
        setInvited(false);
      }
    });
  }, [users]);

  // watches invited for changes; if the user was invited, begin socketConnect
  // useEffect(() => {
  //   if (party.inviteOnly === false || (invited === true)) {
  //     console.log(invited, 'inside if statement');
  //     if (roomID.oldRoom === null) {
  //       joinParty();
  //       console.log(`user ${socket.id} joined party`);
  //     }
  //   }
  // }, [invited]);

  // to do: make all this render only if a user is invited
  return (
    <div className="container p-4">
      {/* Header */}
      <div className="px-4">
        {`Party Name: ${party.name} ${roomID.newRoom}`}
      </div>
      {/* House */}
      <div className="px-4 float-left">
        <div className="">
          <House
            user={user}
            setRoomID={setRoomID}
            positions={positions}
            setPositions={setPositions}
            socket={socket}
          />
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
          {Object.keys(peers).map((socketId: string) => {
            return (
              <Video key={socketId} peer={peers[socketId]} />
            );
          })}
        </div>
        {/* <div className="mt-6">
          {others.map((other: any) => {
            const { id } = other;
            return (
              <Video key={id} peer={other.peer} />
            );
          })}
        </div> */}
      </div>

      {/* Underneath Chat Feature */}
      <div className="float-left m-6">
        {/* <ChatSend key={user.id} user={user} /> */}
      </div>
    </div>
  );
};

export default HouseParty;
