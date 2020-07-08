import express, { Request, Response, Application } from 'express';
import socketIO, { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';

import path from 'path';
import cors from 'cors';
// import cookieparser from 'cookie-parser';
// import session from 'express-session';
import dotenv from 'dotenv';
// import passport from 'passport';
import sequelize from './db/index';
import { initUser } from './db/models/user';
import { initParty } from './db/models/party';
import { initMessage } from './db/models/message';
import { initUserParty, associateUserParty } from './db/models/userParty';
import routes from './routes';

dotenv.config();

class Server {
  private httpServer: HTTPServer;

  private app: Application;

  private io: SocketIOServer;

  private activeSockets: string[] = [];

  private readonly DEFAULT_PORT = 8080;

  constructor() {
    this.initialize();

    this.app.use('/', routes);

    this.app.use(express.static(`${path.resolve('./')}/client/build`));

    // for any requests to wildcard endpoints (from react router), serve the static build files
    this.app.get('*', (req: Request, res: Response): void => {
      res.sendFile(`${path.resolve('./')}/client/build/index.html`);
    });
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = socketIO(this.httpServer);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
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
    initUser(sequelize);
    initParty(sequelize);
    initMessage(sequelize);
    initUserParty(sequelize);
    associateUserParty();
    // sequelize.sync({ force: true }); // if you need to drop the tables
    sequelize.sync(); // if you just need to update the tables

    // async function doStuffWithUser() {
    //   const newUser = await User.create({
    //     nameFirst: 'pop',
    //     // nameLast: 'skippy',
    //     username: 'pop-skippy',
    //     password: 'pop',
    //     email: 'skippy@email.com',
    //     // avatar: 'an-avatar.com',
    //   });
    //   console.log(newUser);
    // }
    // doStuffWithUser();
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
