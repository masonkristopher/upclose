import React, {
  Dispatch, FC, ReactElement, SetStateAction, useState, useEffect, useRef,
} from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import ChatSend from './ChatSend';
import PlayerVideoPanel from './PlayerVideoPanel';
import Room from './Room';
import Video from './Video';

import {
  createHouse,
  House,
  Party,
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
    currentRoom: '',
    top: randomPosition(),
    left: randomPosition(),
  },
}): ReactElement => {
  // access the partyId from the route using useParams.
  const { partyId }: any = useParams();
  const playerSocket = socket.id;

  const [invited, setInvited]: any = useState(null);
  const [users, setUsers]: any = useState([]);

  const [party, setParty]: [
    Party,
    Dispatch<SetStateAction<Party>>,
  ] = useState({});

  const [house, setHouse]: [
    House,
    Dispatch<SetStateAction<House>>,
  ] = useState({});

  const [peers, setPeers]: [
    Peers,
    Dispatch<SetStateAction<Peers>>,
  ] = useState({});

  const [positions, setPositions]: [
    Positions,
    Dispatch<SetStateAction<Positions>>,
  ] = useState({
    [playerSocket]: initialPlayerPosition,
  });

  const userVideo = useRef<HTMLVideoElement>(null);

  const joinParty = () => {
    const rooms = Object.keys(house);
    console.log('rooms:', rooms);
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        (userVideo.current as HTMLVideoElement).srcObject = stream;
        socket.emit('join room', positions[playerSocket], rooms);

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
            socket.emit('player moved', { [socket.id]: positions[socket.id] }, rooms);
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

        socket.on('update player', (position: Record<string, Position>) => {
          const playerId = Object.keys(position)[0];
          if (playerId !== playerSocket) {
            positions[playerId] = position[playerId];
            setPositions({ ...positions });
          }
        });
      });
  };

  // Runs once when HouseParty component initially renders
  useEffect(() => {
    // should query the database and find the party we need on render
    axios.get(`/party/${partyId}`)
      .then(({ data }) => {
        // then use setParty to put the party's info into state
        const {
          idRoomOne, idRoomTwo, idRoomThree, idRoomFour,
        } = data;
        positions[playerSocket].currentRoom = idRoomOne;
        setHouse(createHouse(idRoomOne, idRoomTwo, idRoomThree, idRoomFour));
        setPositions({ ...positions });
        setParty(data);
        return axios.get(`/party/getUsers/${partyId}`);
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (positions[playerSocket].currentRoom !== '') {
      joinParty();
    }
  }, [party]);

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
        {/* {party != {}
        && ( */}
        <Room
          house={house}
          currentRoom={positions[socket.id].currentRoom}
          party={party}
          positions={positions}
          setPeers={setPeers}
          setPositions={setPositions}
          socket={socket}
        />
        {/* )} */}
      </div>
      <div className="bg-gray-100 md:float-left pl-4">
        {/* {party != {}
        && ( */}
        <PlayerVideoPanel
          party={party}
          positions={positions}
          socket={socket}
          userVideo={userVideo}
        />
        {/* )} */}
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
