import { Express, Request, Response } from 'express';
import path from 'path';
// import express from 'express';
import { DataTypes } from 'sequelize';
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
