import { initUser, User } from './models/user';
import sequelize from './index';
import { UserParty, initUserParty } from './models/userParty';
import { Party, initParty } from './models/party';
import { Message, initMessage } from './models/message';

initUser(sequelize);
initParty(sequelize);
initUserParty(sequelize);
initMessage(sequelize);

// CREATE A USER
const createUser = async (userObj) => {
  try {
    return await User.create(userObj);
  } catch (err) {
    console.error(err);
  }
};

//  GET ALL USERS
const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      raw: true,
    });
    return users;
  } catch (err) {
    console.error(err);
  }
};

// RETRIEVE USER BY GOOGLEID
const getUser = async (googleId) => {
  try {
    const user = await User.findOne({ where: { googleId } });
    return user;
  } catch (err) {
    console.error(err);
  }
};

const getUserById = async (id) => {
  try {
    return await User.findOne({ where: { id } });
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
    return UserParty.findAll({ where: { idUser: id } })
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

// GET ALL USERS THAT HAVE JOINED A PARTY
const getUsersInParty = async (idParty) => {
  try {
    // query join table to find all parties that match a given party id
    return UserParty.findAll({ where: { idParty } })
      .then((joinedParties) => {
        // now that we have all those parties, we match the user's ids to actual user objects
        const users = joinedParties.map((joinedParty) => {
          return User.findOne({ where: { id: joinedParty.idUser } });
        });
        // promise.all ensures that all the findOnes have resolved before returning
        return Promise.all(users);
      });
  } catch (err) {
    console.error(err);
  }
};

// GET ONE PARTY BY ID
const getParty = async (id) => {
  try {
    const party = Party.findOne({ where: { id } });
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
};

// DELETE A PARTY
const deleteParty = async (idParty) => {
  try {
    // delete party from party table
    Party.destroy({ where: { id: idParty } });
    // then delete all the reference in UserParty table
    UserParty.destroy({ where: { idParty } });
  } catch (err) {
    console.error(err);
  }
};

// UPDATE A PARTY
const updateParty = async (partyObj) => {
  try {
    await Party.update(partyObj,
      { returning: true, where: { id: partyObj.id } });
  } catch (err) {
    console.error(err);
  }
};

const deleteFromParty = async (idUser, idParty) => {
  try {
    UserParty.destroy({
      where: {
        idUser,
        idParty,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

const getMessagesWithOneUser = async (idSender, idRecipient) => {
  try {
    return await Message.findAll({
      where:
        {
          idSender,
          idRecipient,
        },
    });
  } catch (err) {
    console.error(err);
  }
};

const getUsersSendersIds = async (idRecipient) => {
  try {
    const senders = await Message.findAll({
      where: {
        idRecipient,
      },
      attributes: [
        'idSender',
      ],
    });
    return senders.map(sender => {
      return sender.getDataValue('idSender');
    });
  } catch (err) {
    console.error(err);
  }
};
const getUsersRecipientsIds = async (idSender) => {
  try {
    const recipients = await Message.findAll({
      where: {
        idSender,
      },
      attributes: [
        'idRecipient',
      ],
    });
    return recipients.map(recipient => {
      return recipient.getDataValue('idRecipient');
    });
  } catch (err) {
    console.error(err);
  }
};

const getAllUsersThreads = async (userId) => {
  try {
    const recipients = await getUsersSendersIds(userId);
    const senders = await getUsersRecipientsIds(userId);
    const allUsersThreadsUsersIds = [];
    recipients.concat(senders).forEach(id => {
      if (!allUsersThreadsUsersIds.includes(id)) {
        allUsersThreadsUsersIds.push(id);
      }
    });
    // console.log(allUsersThreadsUsersIds);
    return allUsersThreadsUsersIds;
  } catch (err) {
    console.error(err);
  }
};

getAllUsersThreads(1);
export {
  createUser,
  getAllUsers,
  getUser,
  getUserById,
  updateUser,
  getParty,
  addUserToParty,
  getUsersInParty,
  getAllParties,
  createParty,
  deleteParty,
  updateParty,
  deleteFromParty,
  getMessagesWithOneUser,
  getUsersSendersIds,
  getUsersRecipientsIds,
  getAllUsersThreads,
};
