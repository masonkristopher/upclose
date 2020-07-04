import {Express, Request, Response} from "express";
import path from "path";
import express from "express";

export class Server {

    private app: Express;

    constructor(app: Express) {
        this.app = app;

        this.app.get("/api", (req: Request, res: Response): void => {
            console.log('hit me');
            res.send("You have reached the API!");
        })
    }
    

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }

}