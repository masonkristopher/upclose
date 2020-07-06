import { Express, Request, Response } from 'express';
import * as path from 'path';
import express from 'express';

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
  }
}

export default Server;
