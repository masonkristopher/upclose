/* User Interface */
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

/* House Structure */
type layout = 'red' | 'green' | 'blue' | 'yellow';

interface Room {
  name: layout,
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
    name: 'red',
    xChange: 'blue',
    yChange: 'green',
  },
  blue: {
    name: 'blue',
    xChange: 'red',
    yChange: 'yellow',
  },
  green: {
    name: 'green',
    xChange: 'yellow',
    yChange: 'red',
  },
  yellow: {
    name: 'yellow',
    xChange: 'green',
    yChange: 'blue',
  },
};

/* Room */
export const roomSize = 500;

export type dir = 'LEFT' | 'UP' | 'RIGHT' | 'DOWN';

export interface Direction {
  top: 0 | 1;
  left: 0 | 1;
  dir: dir;
}

export enum RoomStyles {
  red = 'bg-red-300',
  green = 'bg-green-300',
  blue = 'bg-blue-300',
  yellow = 'bg-yellow-300',
}

/* Player */
export interface Position {
  avatar: string,
  top: number,
  left: number,
}
