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
    // first find all the parties a user has accepted in the userParty table
    const acceptedParties = await UserParty.findAll({ where: { idUser: id, inviteStatus: 'accepted' } })
      .then((parties) => {
        // return all the actual party objects
        const p = parties.map((party) => {
          return Party.findOne({ where: { id: party.idParty } });
        });
        // Promise.all ensures the promises resolve before we return
        return Promise.all(p);
      });

    // add an inviteStatus to each party object, for use in the frontend
    acceptedParties.forEach((party: any) => {
      party.dataValues.inviteStatus = 'accepted';
    })

    // same thing with pendingParties
    const pendingParties = await UserParty.findAll({ where: { idUser: id, inviteStatus: 'pending' } })
      .then((parties) => {
        const a = parties.map((party) => {
          return Party.findOne({ where: { id: party.idParty } });
        });
        return Promise.all(a);
      });

    pendingParties.forEach((party: any) => {
      party.dataValues.inviteStatus = 'pending';
    })

    // return all parties
    return acceptedParties.concat(pendingParties);
  } catch (err) {
    console.error(err);
  }
};

// GET ALL USERS THAT HAVE JOINED A PARTY
const getAllUsersInParty = async (idParty) => {
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

// GET ONE ENTRY FROM THE USERPARTY TABLE
const getUserInParty = async (idUser, idParty) => {
  try {
    return UserParty.findOne({ where: { idUser, idParty } });
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
const addUserToParty = async (idUser, idParty, inviteStatus) => {
  try {
    const party = await Party.findOne({ where: { id: idParty } });
    const user = await User.findOne({ where: { id: idUser } });
    // @ts-ignore             ***************to do fix meeeeee pleeeeeaseseesaaaa
    party.addUser(user, { through: { inviteStatus } });
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

// DELETE AN ENTRY IN THE USERPARTY TABLE
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

// UPDATE USERPARTY with a new inviteStatus
const updateUserParty = async (idUser, idParty, inviteStatus) => {
  try {
    await UserParty.update({ inviteStatus },
      { returning: true, where: { idUser, idParty } });
  } catch (err) {
    console.error(err)
  }
}

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

const getAllUserMessages = async (idSender, idRecipient) => {
  try {
    return await Message.findAll({
      // attributes: ['message'],
      where: {
        idSender,
        idRecipient,
      },
      raw: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const sendUserMessage = async (messageObj) => {
  try {
    return await Message.create(messageObj);
  } catch (error) {
    console.log(error);
  }
};

export {
  createUser,
  getAllUsers,
  getUser,
  getUserById,
  updateUser,
  getParty,
  addUserToParty,
  getAllUsersInParty,
  getUserInParty,
  getAllParties,
  createParty,
  deleteParty,
  updateParty,
  updateUserParty,
  deleteFromParty,
  getMessagesWithOneUser,
  getUsersSendersIds,
  getUsersRecipientsIds,
  getAllUsersThreads,
  getAllUserMessages,
  sendUserMessage,
};
