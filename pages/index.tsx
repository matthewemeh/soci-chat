import { useContext, useEffect } from 'react';
import { NextRouter, useRouter } from 'next/router';

import Chat from '@/components/Chat';
import Sidebar from '@/components/Sidebar';

import { AuthContext } from '@/context/AuthContext';
import { AuthContextData } from '@/public/interfaces';

const Home = () => {
  const router: NextRouter = useRouter();
  const { currentUser, setChat } = useContext<AuthContextData>(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login').then(() => {
        setChat!(null);
      });
    } else if (!currentUser.emailVerified) {
      router.push('/verify-email');
    }
  }, []);

  return (
    <main className='home'>
      <div className='container'>
        <Sidebar />
        <Chat />
      </div>
    </main>
  );
};

export default Home;
