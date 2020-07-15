import express from 'express';
import { getMessagesWithOneUser, getAllUsersThreads, sendUserMessage } from '../db/methods';

const messagesRouter = express.Router();

messagesRouter.get('/all/:idSender/:idRecipient', (req, res) => {
  const { idSender, idRecipient } = req.params;
  getMessagesWithOneUser(idSender, idRecipient)
    .then(messages => {
      res.send(messages);
    })
    .catch(err => console.error(err));
});

messagesRouter.get('/threads/:id', (req, res) => {
  const { id } = req.params;
  getAllUsersThreads(id)
    .then(idArr => {
      res.send(idArr);
    })
    .catch(err => console.error(err));
});

messagesRouter.post('/send', (req, res) => {
  sendUserMessage(req.body)
    .then(() => {
      res.send('message sent');
    })
    .catch(err => console.error(err));
});

export default messagesRouter;
