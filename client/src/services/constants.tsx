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
const videoConstraints: MediaTrackConstraints = {
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

const house: House = {
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

/* Room Size */
const roomSize = 500;

export {
  house,
  videoConstraints,
  roomSize,
};
