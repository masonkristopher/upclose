import React, { useState } from 'react';
import EditUserDetails from './EditUserDetails';

const UserProfile = () => {
  // change this to use the passed in user object
  const [user, setUser] = useState({
    id: 1,
    username: 'Nass',
    firstName: 'Naseer',
    lastName: 'Hines',
    email: 'Hinesnaseer@gmail.com',
    avatar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTC7HaayceZ-Ql4p8mqmcw2-Z0YF5SgaagdIg&usqp=CAU',
  });
  const [showEditForm, setShowEditForm]: any = useState(false);

  // Cheeky but for now store user and set user on its own object so ts doesn't hate me
  // const [propStuff, setPropStuff] = useState({
  //   user,
  //   setShowEditForm,
  // });

  return (
    <div className="p-8">
      {showEditForm
        ? <EditUserDetails user setShowEditForm />
        : (
          <div className="container mx-auto px-4 m-8 grid grid-flowgrid-cols-2 gap-4">
            <div>
              <div className="m-8 lg:flex bg-gray-200 w-full sm:w-full md:w-4/6 lg:w-4/6 xl:w-4/6 rounded overflow-hidden shadow-lg">
                <img
                  className="rounded-full h-16 w-16 flex items-center justify-center"
                  src={user.avatar}
                  alt={user.avatar}
                />
              </div>
              <div className="lg:flex bg-gray-200 w-full sm:w-full md:w-4/6 lg:w-4/6 xl:w-4/6 rounded overflow-hidden shadow-lg">
                <div className="m-8">
                  <p className="text-gray-900 font-bold text-xl mb-2">
                    {user.username}
                  </p>
                  <p className="text-gray-900 font-bold text-xl mb-2">
                    {user.firstName}
                    {' '}
                    {user.lastName}
                  </p>
                  <p className="text-gray-900 font-bold text-xl mb-2">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default UserProfile;
