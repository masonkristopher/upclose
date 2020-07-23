import Peer from 'simple-peer';

/* User */
export interface User {
  id: number;
  nameFirst: string;
  nameLast: string;
  username: string;
  email: string;
  avatar: string;
  googleId: string;
}

/* Video */
export const videoConstraints: MediaTrackConstraints = {
  width: 320,
  height: 180,
};

/* House */
export interface Position {
  avatar: string;
  currentRoom: string;
  top: number;
  left: number;
}

export type Peers = Record<string, Peer.Instance>;
export type Positions = Record<string, Position>;

interface Room {
  xChange: string;
  yChange: string;
}

export type House = Record<string, Room>;

export const createHouse = (
  idRoomOne: string,
  idRoomTwo: string,
  idRoomThree: string,
  idRoomFour: string,
): House => {
  return {
    [idRoomOne]: {
      xChange: idRoomTwo,
      yChange: idRoomThree,
    },
    [idRoomTwo]: {
      xChange: idRoomOne,
      yChange: idRoomFour,
    },
    [idRoomThree]: {
      xChange: idRoomFour,
      yChange: idRoomOne,
    },
    [idRoomFour]: {
      xChange: idRoomThree,
      yChange: idRoomTwo,
    },
  };
};

/* Room */
export const roomSize = 500;

export type Dir = 'LEFT' | 'UP' | 'RIGHT' | 'DOWN';

export interface Direction {
  top: 0 | 1 | -1;
  left: 0 | 1 | -1;
  dir: Dir;
}

export enum RoomStyles {
  red = 'bg-myred',
  green = 'bg-mygreen',
  blue = 'bg-myblue',
  yellow = 'bg-myyellow',
  orange = 'bg-myorange',
  purple = 'bg-mypurple',
  pink = 'bg-mypink',
  white = 'bg-mywhite',
  black = 'bg-myblack',
  brown = 'bg-mybrown'
}

export type RoomStyle = 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'purple' | 'pink' | 'white' | 'black' | 'brown';

/* Player */
export const randomPosition = () => {
  let x = Math.floor(Math.random() * 500);
  while (x % 50 !== 0) {
    x -= 1;
  }
  return x;
};

/* Party */
export interface Party {
  id?: number,
  name?: string,
  idLayout?: number,
  idCreator?: number,
  idRoomOne?: string,
  idRoomTwo?:string,
  idRoomThree?:string,
  idRoomFour?:string,
  roomOneBackground?: string,
  roomTwoBackground?: string,
  roomThreeBackground?: string,
  roomFourBackground?: string,
  inviteOnly?: boolean,
  inviteStatus?: string,
  createdAt?: string,
  updatedAt?: string,
}
