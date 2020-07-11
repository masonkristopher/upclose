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

// socket
const users = {};
const socketToRoom = {};

io.on('connection', socket => {
  socket.on('chat message', msg => {
    console.log(msg);
    io.emit('sending chat message', msg);
  });

  socket.on('join room', roomID => {
    if (users[roomID]) {
      const { length } = users[roomID];
      if (length === 4) {
        socket.emit('room full');
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

    socket.emit('all users', usersInThisRoom);
  });

  socket.on('sending signal', payload => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on('returning signal', payload => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on('disconnect', () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter(id => id !== socket.id);
      users[roomID] = room;
    }
  });
});

export default server;
