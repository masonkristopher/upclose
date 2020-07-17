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
  socket.on('join room', (playerPosition) => {
    const newRoom = playerPosition.currentRoom;
    socket.join(newRoom, () => {
      socket.broadcast.emit('update player', { [socket.id]: playerPosition });
      io.to(newRoom).emit('user joined room', socket.id);
    });
  });

  // if user switches room
  socket.on('switch room', (previousRoom: string, newRoom: string) => {
    socket.leave(previousRoom, () => {
      socket.broadcast.emit('user left room', socket.id, newRoom);
      socket.join(newRoom, () => {
        io.to(newRoom).emit('user joined room', socket.id);
      });
    });
  });

  socket.on('created peer signal', payload => {
    io.to(payload.userToSignal).emit('connection requested', { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on('returning signal', payload => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on('player moved', payload => {
    socket.broadcast.emit('update player', payload);
  });

  socket.on('chat message', payload => {
    socket.broadcast.emit('sending chat message', payload);
  });

  socket.on('disconnect', () => {
    // emit back to last room that you left
    socket.broadcast.emit('user left party', socket.id);
    console.log(`user disconnected: ${socket.id}`);
  });
});

export default server;
