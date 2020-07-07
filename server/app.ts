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

  private activeSockets: string[] = [];

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
    this.io.on('connection', (socket) => {
      console.log('socket connected');

      const existingSocket = this.activeSockets.find(activeSocket => activeSocket === socket.id);

      if (!existingSocket) {
        this.activeSockets.push(socket.id);

        socket.emit('update-user-list', {
          users: this.activeSockets.filter(activeSocket => activeSocket !== socket.id),
        });

        socket.broadcast.emit('update-user-list', {
          users: [socket.id],
        });
      }

      socket.on('call-user', (data: any) => {
        socket.to(data.to).emit('call-made', {
          offer: data.offer,
          socket: socket.id,
        });
      });

      socket.on('make-answer', (data: any) => {
        socket.to(data.to).emit('answer-made', {
          socket: socket.id,
          answer: data.answer,
        });
      });

      socket.on('reject-call', (data: any) => {
        socket.to(data.from).emit('call-rejected', { socket: socket.id });
      });

      socket.on('disconnect', () => {
        this.activeSockets = this.activeSockets.filter(activeSocket => activeSocket !== socket.id);
        socket.broadcast.emit('remove-user', { socketId: socket.id });
      });
    });
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

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () => callback(this.DEFAULT_PORT));
  }
}

export default Server;

// import { Express, Request, Response } from 'express';
// // import path from 'path';
// // import express from 'express';

// class Server {
//   private app: Express;

//   constructor(app: Express) {
//     this.app = app;
//     this.app.get('/api', (req: Request, res: Response): void => {
//       console.log('hit me');
//       res.send('You have reached the API!');
//     });
//   }

//   public start(port: number): void {
//     this.app.listen(port, () => {
//       console.log(`Server listening on port ${port}!`);
//     });
//   }
// }

// export default Server;
