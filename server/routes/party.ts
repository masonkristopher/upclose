import express from 'express';
import { getAllParties, getParty } from '../db/methods';

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

// retrieve one party by its id
partyRouter.get('/:id', (req, res) => {
  // party's id
  const { id } = req.params;
  getParty(id)
    .then((party) => {
      console.log(party, 'after getParty in party.ts *********')
      res.send(party);
    })
    .catch(err => console.error(err));
});

export default partyRouter;
