import React, {
  FC, ReactElement, useState, useEffect, useRef,
} from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import ChatSend from './ChatSend';
import PlayerVideoPanel from './PlayerVideoPanel';
import Room from './Room';
import Video from './Video';

import {
  Peers,
  Position,
  Positions,
  User,
  randomPosition,
  videoConstraints,
} from '../services/constants';

import { addPeer, createPeer } from '../services/peerServices';

const socket = io.connect('/');

interface HousePartyProps {
  user: User;
  initialPlayerPosition?: Position;
}

// this component will be rendered from the Navbar, via a link in the PartyProfile page
// its route will be /party/partyId
const HouseParty: FC<HousePartyProps> = ({
  user,
  initialPlayerPosition = {
    avatar: user.avatar,
    currentRoom: 'red',
    top: randomPosition(),
    left: randomPosition(),
  },
}): ReactElement => {
  // access the partyId from the route using useParams.
  const { partyId }: any = useParams();
  const playerSocket = socket.id;

  const [invited, setInvited]: any = useState(null);
  const [party, setParty]: any = useState({});
  const [users, setUsers]: any = useState([]);

  const [peers, setPeers]: [
    Peers,
    React.Dispatch<React.SetStateAction<Peers>>,
  ] = useState({});

  const [positions, setPositions]: [
    Positions,
    React.Dispatch<React.SetStateAction<Positions>>,
  ] = useState({
    [playerSocket]: initialPlayerPosition,
  });

  const userVideo = useRef<HTMLVideoElement>(null);

  const joinParty = () => {
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        (userVideo.current as HTMLVideoElement).srcObject = stream;
        socket.emit('join room', positions[playerSocket]);

        // remove user from peers but not positions
        socket.on('user left room', (leavingUserId: string, newRoom: string) => {
          if (positions[playerSocket].currentRoom !== newRoom) {
            delete peers[leavingUserId];
            setPeers({ ...peers });
          }
        });

        // create new peer for new other users in room
        socket.on('user joined room', (joiningUserId: string) => {
          if (joiningUserId !== socket.id) {
            socket.emit('player moved', { [socket.id]: positions[socket.id] });
            const peer = createPeer(socket, joiningUserId, socket.id, stream);
            peers[joiningUserId] = peer;
            setPeers({ ...peers });
          }
        });

        // add peer that is requesting connection
        socket.on('connection requested', (payload: any) => {
          const peer = addPeer(
            socket,
            payload.signal,
            payload.callerID,
            stream,
          );
          peers[payload.callerID] = peer;
          setPeers({ ...peers });
        });

        socket.on('receiving returned signal', (payload: any) => {
          if (peers[payload.id]) {
            peers[payload.id].signal(payload.signal);
          }
        });

        socket.on('user left party', (leavingUserId: string) => {
          delete positions[leavingUserId];
          delete peers[leavingUserId];
          setPositions({ ...positions });
          setPeers({ ...peers });
        });

        socket.on('update player', (payload: any) => {
          const playerId = Object.keys(payload)[0];
          positions[playerId] = payload[playerId];
          setPositions({ ...positions });
        });
      });
  };

  // Runs once when HouseParty component initially renders
  useEffect(() => {
    joinParty();
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

  // to do: uncomment this to check that a user is involved in a party *************************

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
    <div className="pl-8 pt-4">
      <h1 className="text-xl">Party Name</h1>
      <div className="float-left">
        <Room
          name={positions[socket.id].currentRoom}
          party={party}
          positions={positions}
          setPeers={setPeers}
          setPositions={setPositions}
          socket={socket}
        />
      </div>
      <div className="bg-gray-100 md:float-left pl-4">
        <PlayerVideoPanel
          positions={positions}
          socket={socket}
          userVideo={userVideo}
        />
      </div>

      {/* Peer Videos */}
      <div className="bg-gray-100 md:float-left pl-4">
        {Object.keys(peers).map((socketId: string) => {
          return (
            <Video
              key={socketId}
              id={socketId}
              peer={peers[socketId]}
              positionA={positions[socketId]}
              positionB={positions[playerSocket]}
              positions={positions}
            />
          );
        })}
      </div>

      {/* Underneath Chat Feature */}
      <div className="clear-both py-6">
        <h1>Party Chat</h1>
        <ChatSend key={user.id} user={user} socket={socket} />
      </div>
    </div>
  );
};

export default HouseParty;
