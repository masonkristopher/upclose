import React from 'react';

interface UserInterface {
  id: number,
  nameFirst: string,
  nameLast: string,
  username: string,
  email: string,
  avatar: string,
  googleId: string,
}

const ctxt = React.createContext<UserInterface | null>(null);

export const UserContextProvider = ctxt.Provider;

export const UserContextConsumer = ctxt.Consumer;
