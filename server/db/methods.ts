import { initUser, User } from './models/user';
import sequelize from './index';
import { UserParty, initUserParty } from './models/userParty';
import { Party, initParty } from './models/party';

initUser(sequelize);
initParty(sequelize);
initUserParty(sequelize);

// CREATE A USER
const createUser = async (userObj) => {
  try {
    return await User.create(userObj);
  } catch (err) {
    console.error(err);
  }
};

// RETRIEVE USER BY GOOGLEID
const getUser = async (googleId) => {
  try {
    const user = await User.findOne({where: { googleId } });
    return user;
  } catch (err) {
    console.error(err);
  }
};

// UPDATE USER DATA
const updateUser = async (userObj) => {
  try {
    await User.update(userObj,
      { returning: true, where: { id: userObj.id } });
  } catch (err) {
    console.error(err);
  }
};

// GET ALL A USER'S PARTIES, BY USERID
const getAllParties = async (id) => {
  try {
    // we need to query our user/party join table and return all parties that match the user's id
    return UserParty.findAll({ where: { idUser: id }})
      .then((joinedParties) => {
        // now that we have all the parties a user is a part of, we find the actual party objects
        const parties = joinedParties.map((joinedParty) => {
          return Party.findOne({ where: { id: joinedParty.idParty } });
        });
        // promise.all ensures that all the findOnes have resolved before returning
        return Promise.all(parties);
      });
  } catch (err) {
    console.error(err);
  }
};

// GET ONE PARTY BY ID
const getParty = async (id) => {
  try {
    const party = Party.findOne({where: { id } });
    return party;
  } catch (err) {
    console.error(err);
  }
};

// ADDS A USER AND PARTY TO THE USERPARTY JOIN TABLE
const addUserToParty = async (idUser, idParty) => {
  try {
    const party = await Party.findOne({ where: { id: idParty } });
    const user = await User.findOne({ where: { id: idUser } });
    party.addUser(user);
  } catch (err) {
    console.error(err);
  }
};

// CREATE A PARTY
const createParty = async (party) => {
  try {
    return Party.create(party);
  } catch (err) {
    console.error(err);
  }
}
export {
  createUser,
  getUser,
  updateUser,
  getParty,
  addUserToParty,
  getAllParties,
  createParty,
};
