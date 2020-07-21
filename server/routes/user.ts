import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import {
  createUser,
  addUserToParty,
  getUser,
  getUserById,
  updateUser,
  updateUserParty,
  getAllUsers,
  deleteFromParty,
} from '../db/methods';

const userRouter = express.Router();

// send the id token to google to double check that it's real
userRouter.post('/verify', (req, res) => {
  // console.log(req.body, 'beginning of userRoute');
  const { id_token, userObj } = req.body;
  console.log(userObj, 'userOj')
  const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
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
    .then((userData: any) => {
      // if the user is in our database
      if (userData && userData.dataValues) {
        res.send(userData.dataValues);
      } else {
        // user is not in database, so let's add the user
        const {
          yu, Cd, OU, PK, sU, sW,
        } = userObj.Ot;
        const user = {
          nameFirst: sW,
          nameLast: sU,
          username: Cd,
          email: yu,
          avatar: PK,
          googleId: OU,
        };
        createUser(user);
        res.send(user);
      }
    })
    .catch(console.error);
});

userRouter.put('/profile/edit', (req, res) => {
  console.log(req.body);
  const { userObj } = req.body;
  updateUser(userObj)
    .then((data) => {
      console.log(data);
      res.send('changed user data');
    })
    .catch((error) => console.log(error));
});

// add a user and its inviteStatus to the userParty table
userRouter.post('/:idUser/joins/:idParty', (req, res) => {
  const { idUser, idParty } = req.params;
  const { inviteStatus } = req.body;
  addUserToParty(idUser, idParty, inviteStatus)
    .then(() => {
      res.send('user added to party');
    })
    .catch((err) => console.error(err));
});

// dummy route to add users via postman
userRouter.post('/add', (req, res) => {
  const user = req.body;
  createUser(user);
  res.send(user);
});

// Get all user from db
userRouter.get('/all', (req, res) => {
  getAllUsers()
    .then((users) => {
      res.send(users);
    })
    .catch(error => console.error(error));
});

userRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  getUserById(id)
    .then((user) => {
      res.send(user);
    })
    .catch(error => console.error(error));
});

// delete user from UserParty table
userRouter.delete('/userParty/:idUser/:idParty', (req, res) => {
  const { idUser, idParty } = req.params;
  deleteFromParty(idUser, idParty)
    .then(() => {
      res.send('user deleted');
    })
    .catch(error => console.error(error));
});

// update the inviteStatus in the userParty table
userRouter.put('/userParty/:idUser/:idParty/:inviteStatus', (req, res) => {
  const { idUser, idParty, inviteStatus } = req.params;
  updateUserParty(idUser, idParty, inviteStatus)
    .then(() => {
      res.send('invitation status changed');
    })
    .catch(err => console.error(err));
});

export default userRouter;
