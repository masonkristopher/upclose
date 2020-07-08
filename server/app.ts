import express, { Express, Request, Response, Application } from 'express';
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

  private users: any = {};

  private socketToRoom: any = {};

  private readonly DEFAULT_PORT = 8080;

  constructor() {
    this.initialize();
    this.handleSocketConnection();
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
    initUser(sequelize);
    initParty(sequelize);
    initMessage(sequelize);
    initUserParty(sequelize);
    associateUserParty();
    sequelize.sync({ force: true }); // if you need to drop the tables
    // sequelize.sync(); // if you just need to update the tables
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
