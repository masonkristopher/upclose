import React, { useState, FC } from 'react';
import EditUserDetails from './EditUserDetails';

interface UserProfileProps {
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

const UserProfile: FC<UserProfileProps> = ({ user, setUser }) => {
  const [showEditForm, setShowEditForm]: any = useState(false);

  console.log(user);
  return (
    <div className="p-8">
      {showEditForm ? (
        <EditUserDetails setShowEditForm={setShowEditForm} user={user} setUser={setUser} />
      ) : (
        <div>
          <img
            className="flex-col object-cover rounded-full mx-auto h-6 w-6 sm:w-full sm:h-64 md:w-full md:h-64 lg:w-2/5 lg:h-auto xl:w-2/5 xl:h-auto"
            src={user.avatar}
            alt={user.username}
          />
          <h3>Username</h3>
          <p className="text-gray-900 font-bold text-xl mb-2">
            {user.username}
          </p>
          <h3>First Name</h3>
          <p className="text-gray-900 font-bold text-xl mb-2">
            {user.nameFirst}
          </p>
          <h3>Last Name</h3>
          <p className="text-gray-900 font-bold text-xl mb-2">
            {user.nameLast}
          </p>
          <h3>Email</h3>
          <p className="text-gray-900 font-bold text-xl mb-2">{user.email}</p>
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-blue-400 rounded shadow m-4"
            type="button"
          >
            Edit User Details
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
