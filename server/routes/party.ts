import express from 'express';
import { getAllParties } from '../db/methods';

const partyRouter = express.Router();

// retrieve all the parties a user belongs to
partyRouter.get('/all/:id', (req, res) => {
  // user's id
  const { id } = req.params;
  getAllParties(id)
    .then((parties) => {
      res.send(parties);
    })
    .catch(err => console.error(err));

});

export default partyRouter;
