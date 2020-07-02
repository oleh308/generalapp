import React, { useState, useReducer } from 'react';
import Modal from '../components/blocks/Modal';

const ProfileContext = React.createContext();

function ProfileProvider({children, defaultProfile}) {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'update':
        return { ...state, profile: action.data };
      default:
        throw new Error();
    };
  }, { profile: null });

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  )
}

export {
  ProfileContext,
  ProfileProvider
}
