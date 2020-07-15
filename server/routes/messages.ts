import express from 'express';
import { getAllUsersThreads } from '../db/methods';

const messagesRouter = express.Router();

messagesRouter.get('/threads/:id', (req, res) => {
  const { id } = req.params;
  getAllUsersThreads(id)
    .then(idArr => {
      res.send(idArr);
    })
    .catch(err => console.error(err));
});

export default messagesRouter;
