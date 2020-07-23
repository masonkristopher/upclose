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
    // console.log(userObj);
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
    <div className="mt-20">
      <div className="max-w-md mx-auto py-4 px-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center md:justify-end -mt-16">
          <img className="w-30 h-30 object-cover rounded-full border-4 border-white shadow-lg" alt="Testimonial avatar" src={user.avatar} />
        </div>
        <div className="w-full px-3">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Username
          </p>
          <input onChange={(e) => setUsername(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" value={username} />
        </div>

        <div className="w-full px-3">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            First Name
          </p>
          <input onChange={(e) => setNameFirst(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" value={nameFirst} />
        </div>

        <div className="w-full px-3">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Last Name
          </p>
          <input onChange={(e) => setNameLast(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" value={nameLast} />
        </div>

        <div className="w-full px-3">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Email
          </p>
          <input onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" value={email} />
        </div>

        <div className="w-full px-3">
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Avatar
          </p>
          <input onChange={(e) => setAvatar(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" value={avatar} />
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={(e) => changeUserDetails(e)}
            className="rounded shadow-md flex items-center bg-seaweed px-4 py-2 text-white hover:text-salmon"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserDetails;
