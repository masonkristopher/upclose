import React, { FC, useState, MouseEvent } from 'react';
import axios from 'axios';

interface EditUserDetailsProps {
  setShowEditForm: any,
  user:{
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  },
  setUser: any
}
const EditUserDetails: FC<EditUserDetailsProps> = ({ setShowEditForm, user, setUser }) => {
  // const [id, setId] = useState(user.id);
  const { id } = user;
  const [username, setUsername] = useState(user.username);
  const [nameFirst, setNameFirst] = useState(user.nameFirst);
  const [nameLast, setNameLast] = useState(user.nameLast);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar]: any = useState(user.avatar);

  const changeUserDetails = (event: MouseEvent) => {
    event.preventDefault();
    const userObj = {
      id,
      username,
      nameFirst,
      nameLast,
      email,
      avatar,
    };
    console.log(userObj);
    // make request to change user details
    axios.put('/user/profile/edit', { userObj })
      .then(() => {
        setShowEditForm(false);
        setUser(userObj);
      })
      .catch((err) => console.error(err));

    setShowEditForm(false);
  };

  return (
    <div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
            Username
          </label>
          <input onChange={(e) => setUsername(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" value={username} />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
            First Name
          </label>
          <input onChange={(e) => setNameFirst(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" value={nameFirst} />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
            Last Name
          </label>
          <input onChange={(e) => setNameLast(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" value={nameLast} />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
            Email
          </label>
          <input onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" value={email} />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
            Avatar
          </label>
          <input onChange={(e) => setAvatar(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" value={avatar} />
        </div>
      </div>
      <button onClick={(e) => changeUserDetails(e)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4" type="button">
        Submit
      </button>
    </div>
  );
};

export default EditUserDetails;
