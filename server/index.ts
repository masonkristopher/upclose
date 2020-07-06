import express from 'express';
import Server from './app';

const app = express();

const port = 8080;

const server = new Server(app);
server.start(port);
