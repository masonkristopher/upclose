import express, { Express, Request, Response, Application } from 'express';
import socketIO, { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import path from 'path';
import cors from 'cors';
// import cookieparser from 'cookie-parser';
// import session from 'express-session';
import dotenv from 'dotenv';
// import passport from 'passport';
import { DataTypes } from 'sequelize';
import sequelize from './db/index';
import User from './db/models/user';
import routes from './routes';

dotenv.config();

// const sess = {
//   secret: `${process.env.SESSION_SECRET}`,
//   cookie: {},
//   resave: false,
//   saveUninitialized: true,
// };

// const strategy = new Auth0Strategy(
//   {
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:
//       process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/',
//   },
//   (accessToken, refreshToken, extraParams, profile, done) => {
//     return done(null, profile);
//   },
// );

class Server {
  private httpServer: HTTPServer;

  private app: Application;

  private io: SocketIOServer;

  private activeSockets: string[] = [];

  private readonly DEFAULT_PORT = 8080;

  constructor() {
    this.initialize();
    // this.app.use(cookieparser());
    // this.app.use(session(sess));
    // passport.use(strategy);
    // this.app.use(passport.initialize());
    // this.app.use(passport.session());

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
