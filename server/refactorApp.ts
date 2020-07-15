import express, { Request, Response } from 'express';
import socketConnect from 'socket.io';
import http from 'http';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketConnect(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use('/', routes);
app.use(express.static(`${path.resolve('./')}/client/build`));
app.get('*', (req: Request, res: Response): void => {
  res.sendFile(`${path.resolve('./')}/client/build/index.html`);
});

io.on('connection', socket => {
  // if user joins room
  socket.on('join room', (newRoom: string) => {
    socket.join(newRoom, () => {
      console.log(`${socket.id} joined room ${newRoom}`);
      io.to(newRoom).emit('user joined room', socket.id);
    });
  });
  // if user switches room
  socket.on('switch room', (oldRoom: string, newRoom: string) => {
    socket.leave(oldRoom, () => {
      console.log(`${socket.id} left room ${oldRoom}`);
      // io.to(oldRoom).emit('user left room', socket.id);
      socket.broadcast.emit('user left room', { userId: socket.id, roomId: newRoom });
      socket.join(newRoom, () => {
        console.log(`${socket.id} switched room ${newRoom}`);
        io.to(newRoom).emit('user joined room', socket.id);
      });
    });
  });

  socket.on('created peer signal', payload => {
    console.log('callerID: ', payload.callerID, ' | userToSignal: ', payload.userToSignal);
    console.log('^^^ created peer signal payload ^^^');
    io.to(payload.userToSignal).emit('connection requested', { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on('returning signal', payload => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on('disconnect', () => {
    // emit back to last room that you left
    socket.broadcast.emit('user left party', socket.id);
    console.log(`user disconnected: ${socket.id}`);
  });
});

export default server;

// socket
// const users = {};
// const socketToRoom = {};

// const addUserToRoom = (roomId, socketId) => {
//   // // if there are users in the room already, add the user's socket.id
//   // // otherwise create the room and add the user's socket.id
//   // if (users[roomId]) {
//   //   users[roomId].push(socketId);
//   // } else {
//   //   users[roomId] = [socketId];
//   // }
//   // // filter out the current user
//   // const usersInThisRoom = users[roomId].filter(id => id !== socketId);

//   // socketToRoom[socketId] = roomId;

//   // emit all users to the relevant room
//   // io.to(roomId).emit('all users', usersInThisRoom);
// };

// const removeUserFromRoom = (roomId, socketId) => {
//   const usersInThisRoom = users[roomId].filter(id => id !== socketId);
//   users[roomId] = usersInThisRoom;
//   io.to(roomId).emit('all users', usersInThisRoom);
// };

// const users = {};
// const socketToRoom = {};

// io.on('connection', socket => {
//   // socket.on('chat message', msg => {
//   //   console.log(msg);
//   //   io.emit('sending chat message', msg);
//   // });

//   socket.on('switch room', (oldRoom, newRoom) => {
//     socket.leave(oldRoom);
//     socket.join(newRoom);
//   });

//   socket.on('join room', roomID => {
//     if (users[roomID]) {
//       // const { length } = users[roomID];
//       // if (length === 4) {
//       //   socket.emit('room full');
//       //   return;
//       // }
//       users[roomID].push(socket.id);
//     } else {
//       users[roomID] = [socket.id];
//     }
//     socketToRoom[socket.id] = roomID;
//     const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

//     socket.emit('all users', usersInThisRoom);
//   });

//   socket.on('sending signal', payload => {
//     io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
//   });

//   socket.on('returning signal', payload => {
//     io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
//   });

//   socket.on('disconnect', () => {
//     const roomID = socketToRoom[socket.id];
//     let room = users[roomID];
//     if (room) {
//       room = room.filter(id => id !== socket.id);
//       users[roomID] = room;
//     }
//   });
// });