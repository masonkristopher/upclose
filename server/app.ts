import { Express, Request, Response } from 'express';
// import session from 'express-session';
import dotenv from 'dotenv';
// import passport from 'passport';
// import Auth0Strategy from 'passport-auth0';

dotenv.config();

// const sess = {
//   secret: `${process.env.SESSION_SECRET}`,
//   cookie: {},
//   resave: true,
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
  private app: Express;

  constructor(app: Express) {
    this.app = app;
    // this.app.use(session(sess));
    // passport.use(strategy);
    // this.app.use(passport.initialize());
    // this.app.use(passport.session());
    // passport.serializeUser((user, done) => {
    //   done(null, user);
    // });

    // passport.deserializeUser((user, done) => {
    //   done(null, user);
    // });

    this.app.get('/api', (req: Request, res: Response): void => {
      console.log('hit me');
      res.send('You have reached the API!');
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
    });
  }
}

export default Server;
