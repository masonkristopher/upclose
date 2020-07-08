import express from 'express';
import { addUser, getUser } from '../db/methods';
import { OAuth2Client } from 'google-auth-library';

const userRouter = express.Router();

// send the id token to google to double check that it's real
userRouter.post('/verify', (req, res) => {
  // console.log(req.body, 'beginning of userRoute');
  const { id_token, userObj } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    // this will return a googleId
    return googleId;
  }
  verify()
    .then((googleId) => {
      // we want to query our database instead of sending this id
      // if the id matches someone in our database, send back that user
      // if it does not, create that user in the database and send backthat user
      return getUser(googleId);
    })
    .then((userData:any) => {
      // console.log(userData, 'after getUser*****************');
      // if the user is in our database
      if (userData) {
        // console.log(userData, 'if(userArray)******************');
        res.send(userData);
      } else {
        // user is not in database, so let's add the user
        const { Au, Bd, JU, MK, nU, nW } = userObj.Qt;
        const user = {
          nameFirst: nW,
          nameLast: nU,
          username: Bd,
          email: Au,
          avatar: MK,
          googleId: JU,
        };
        // console.log(user, 'user not found ************');
        addUser(user);
        res.send(user);
      }
    })
    .catch(console.error);
});

export default userRouter;
