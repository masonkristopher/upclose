import { initUser, User } from './models/user';
import sequelize from './index';
import { initUserParty } from './models/userParty';
import { Party, initParty } from './models/party';

initUser(sequelize);
initParty(sequelize);
initUserParty(sequelize);
// ADD A USER
const addUser = async (userObj) => {
  try {
    await User.create(userObj);
  } catch (err) {
    console.error(err);
  }
};

// RETRIEVE USER BY GOOGLEID
const getUser = async (googleId) => {
  // try {
  //   const user = await User.findOne({where: { googleId } });
  //   return user;
  // } catch (err) {
  //   console.error(err);
  // }
};

const addUserToParty = async (idUser, idParty) => {
  try {
    const party = await Party.findOne({ where: { id: idParty } });
    const user = await User.findOne({ where: { id: idUser } });
    party.addUser(user);
  } catch (err) {
    console.error(err);
  }
};
export {
  addUser,
  getUser,
  addUserToParty,
};
