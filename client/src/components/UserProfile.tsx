import React from 'react';

interface IProps {
  user:{ 
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,}
}

const UserProfile: React.FC<IProps> = () => {
  return (
    <div className="text-blue">
      I am the beautiful UserProfile
    </div>
  );
};

export default UserProfile;
