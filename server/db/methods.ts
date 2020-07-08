import User from './models/user';

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

export {
  addUser,
  getUser,
};
