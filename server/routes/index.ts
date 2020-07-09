import { Router } from 'express';
import userRouter from './user';
import partyRouter from './party';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/party', partyRouter);

export default routes;
