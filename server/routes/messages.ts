import express from 'express';
import { getAllUserMessages, getAllUsersThreads, sendUserMessage } from '../db/methods';

const messagesRouter = express.Router();

// messagesRouter.get('/all/:idSender/:idRecipient', (req, res) => {
//   const { idSender, idRecipient } = req.params;
//   getMessagesWithOneUser(idSender, idRecipient)
//     .then(messages => {
//       res.send(messages);
//     })
//     .catch(err => console.error(err));
// });

messagesRouter.get('/all/:idSender/:idRecipient', (req, res) => {
  const { idSender, idRecipient } = req.params;
  getAllUserMessages(idSender, idRecipient)
    .then(currentUserMessages => {
      getAllUserMessages(idRecipient, idSender)
        .then(clickedUserMessages => {
          const allMessages = currentUserMessages.concat(clickedUserMessages).sort((a: any, b: any) => a.id - b.id);
          res.send(allMessages);
        })
        .catch(error => console.error(error));
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
    .then((response) => {
      res.send(response);
    })
    .catch(err => console.error(err));
});

export default messagesRouter;
