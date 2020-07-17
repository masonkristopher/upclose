import Peer from 'simple-peer';

/* User */
export interface User {
  id: number,
  nameFirst: string,
  nameLast: string,
  username: string,
  email: string,
  avatar: string,
  googleId: string,
}

/* Video */
export const videoConstraints: MediaTrackConstraints = {
  width: 320,
  height: 180,
};

/* House */
export interface Position {
  avatar: string,
  currentRoom: layout,
  top: number,
  left: number,
}

export type Peers = Record<string, Peer.Instance>;
export type Positions = Record<string, Position>;

export type layout = 'red' | 'green' | 'blue' | 'yellow';

interface Room {
  xChange: layout,
  yChange: layout,
}

interface House {
  red: Room,
  blue: Room,
  green: Room,
  yellow: Room,
}

export const house: House = {
  red: {
    xChange: 'blue',
    yChange: 'green',
  },
  blue: {
    xChange: 'red',
    yChange: 'yellow',
  },
  green: {
    xChange: 'yellow',
    yChange: 'red',
  },
  yellow: {
    xChange: 'green',
    yChange: 'blue',
  },
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
  red = 'bg-red-300',
  green = 'bg-green-300',
  blue = 'bg-blue-300',
  yellow = 'bg-yellow-300',
}

/* Player */
export const randomPosition = () => {
  let x = Math.floor(Math.random() * 500);
  while (x % 50 !== 0) {
    x -= 1;
  }
  return x;
};
