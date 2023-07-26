import { auth } from '@/backend/firebase';
import { Unsubscribe } from 'firebase/firestore';
import { fetchData } from '@/backend/firebase-db';
import { User, onAuthStateChanged } from 'firebase/auth';

import { createContext, useEffect, useState } from 'react';

import { AuthContextData, ChatProps, USER } from '@/public/interfaces';

export const AuthContext = createContext<AuthContextData>({});

interface Props {
  children: JSX.Element[];
}

const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = useState<USER[]>([]);
  const [chats, setChats] = useState<ChatProps | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const getUsers = (): void => fetchData('users', setUsers);

  useEffect(() => {
    getUsers();

    const unsubscribe: Unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, chat: chats, setChat: setChats, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
