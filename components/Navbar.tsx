import Image from 'next/image';
import { useContext } from 'react';
import { NextRouter, useRouter } from 'next/router';

import { auth } from '@/backend/firebase';
import { signOut } from 'firebase/auth';

import { AuthContext } from '@/context/AuthContext';
import { AuthContextData } from '@/public/interfaces';
import { showAlert } from '@/public/utils';

/*
  this component is on the left side of the container at the top,
  which contains the user's image, a logout button, etc
*/
const Navbar = () => {
  const router: NextRouter = useRouter();
  const { currentUser, setChat } = useContext<AuthContextData>(AuthContext);

  const username: string = currentUser?.displayName ?? '';
  const photoURL: string | null | undefined = currentUser?.photoURL;

  return (
    <div className='navbar'>
      <span className='logo'>Soci Chat</span>

      <div className='user'>
        {photoURL && <Image src={photoURL} alt='' width={24} height={24} priority />}

        <span>{username}</span>
        <button
          onClick={() => {
            signOut(auth)
              .then(() => {
                router.push('/login').then(() => {
                  setChat!(null);
                });
              })
              .catch(error => {
                console.log(error);
                showAlert({ msg: 'An error occured while logging you out' });
              });
          }}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
