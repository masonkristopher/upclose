import { Router } from 'express';
import userRouter from './user';
import partyRouter from './party';
import messagesRouter from './messages';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/party', partyRouter);
routes.use('/messages', messagesRouter);

export default routes;
