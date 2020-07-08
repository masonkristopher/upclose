import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const userRouter = express.Router();

// send the id token to google to double check that it's real
userRouter.post('/verify', (req, res) => {
  const { id_token } = req.body;
  console.log(id_token, 'id_token');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    return googleId;
  }
  // this will return a googleId
  verify()
    .then((googleId) => {
      // we want to query our database instead of sending this id
      // if the id matches someone in our database, send back that user
      // if it does not, create that user in the database and send backthat user
      res.status(200).send(googleId);
    })
    .catch(console.error);
});

export default userRouter;
