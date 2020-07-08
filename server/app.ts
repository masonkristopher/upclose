import express, { Application, Request, Response } from 'express';
import socketIO, { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
// import * as path from 'path';
// import express, { Express, Request, Response } from 'express';
import path from 'path';
import { DataTypes } from 'sequelize';
import sequelize from './db/index';
import User from './db/models/user';

class Server {
  private httpServer: HTTPServer;

  private app: Application;

  private io: SocketIOServer;

  private users: any = {};

  private socketToRoom: any = {};

  private readonly DEFAULT_PORT = 8080;

  constructor() {
    this.initialize();
    this.handleRoutes();
    this.handleSocketConnection();

    this.app.use(express.static(`${path.resolve('./')}/client/build`));

    this.app.get('/api', (req: Request, res: Response): void => {
      console.log('hit me');
      res.send('You have reached the API!');
    });

    // for any requests to wildcard endpoints (from react router), server the static build files
    this.app.get('*', (req: Request, res: Response): void => {
      res.sendFile(`${path.resolve('./')}/client/build/index.html`);
    });
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = socketIO(this.httpServer);
  }

  private handleRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('<h1>Hello World</h1>');
    });
  }

  private handleSocketConnection(): void {
    this.io.on('connection', socket => {
      socket.on('join room', roomID => {
        if (this.users[roomID]) {
          const { length } = this.users[roomID];
          if (length === 4) {
            socket.emit('room full');
            return;
          }
          this.users[roomID].push(socket.id);
        } else {
          this.users[roomID] = [socket.id];
        }
        this.socketToRoom[socket.id] = roomID;
        const usersInThisRoom = this.users[roomID].filter(id => id !== socket.id);

        socket.emit('all users', usersInThisRoom);
      });

      socket.on('sending signal', payload => {
        this.io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
      });

      socket.on('returning signal', payload => {
        this.io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
      });

      socket.on('disconnect', () => {
        const roomID = this.socketToRoom[socket.id];
        let room = this.users[roomID];
        if (room) {
          room = room.filter(id => id !== socket.id);
          this.users[roomID] = room;
        }
      });
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () => callback(this.DEFAULT_PORT));

    sequelize.authenticate()
      .then(() => {
        console.log('connected to database!');
      })
      .catch((error) => {
        console.error('Unable to connect to the database:', error);
      });

    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        preferredName: {
          type: new DataTypes.STRING(128),
          allowNull: true,
        },
      },
      {
        tableName: 'users',
        sequelize, // passing the `sequelize` instance is required
      },
    );

    sequelize.sync({ force: true }); // if you need to drop the tables
    // sequelize.sync(); // if you just need to update the tables
  }
}

export default Server;
