import express, { Express, Request, Response } from 'express';
import * as path from 'path';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import { DataTypes } from 'sequelize';
import sequelize from './db/index';
import User from './db/models/user';
import routes from './routes';

dotenv.config();

const sess = {
  secret: `${process.env.SESSION_SECRET}`,
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

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
  private app: Express;

  constructor(app: Express) {
    this.app = app;
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(cookieparser());
    this.app.use(session(sess));
    // passport.use(strategy);
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
    this.app.use('/', routes);

    // use the static files from the build
    this.app.use(express.static(`${path.resolve('./')}/client/build`));

    // for any requests to wildcard endpoints (from react router), serve the static build files
    this.app.get('*', (req: any, res: Response): void => {
      console.log(req.session);
      res.sendFile(`${path.resolve('./')}/client/build/index.html`);
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
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
}

export default Server;
