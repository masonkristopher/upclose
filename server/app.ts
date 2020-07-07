import express, { Express, Request, Response } from 'express';
import path from 'path';
import sequelize from './db/index';
import User from './db/models/user';

class Server {
  private app: Express;

  constructor(app: Express) {
    this.app = app;

    // use the static files from the build
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

    // sequelize.sync({ force: true }); // if you need to drop the tables
    sequelize.sync(); // if you just need to update the tables
    async function doStuffWithUser() {
      const newUser = await User.create({
        nameFirst: 'pop',
        // nameLast: 'skippy',
        username: 'pop-skippy',
        password: 'pop',
        email: 'skippy@email.com',
        // avatar: 'an-avatar.com',
      });
      console.log(newUser);
    }
    doStuffWithUser();
  }
}

export default Server;
