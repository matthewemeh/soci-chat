import { NextRouter, useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import useNoInitialEffect from '../hooks/useNoInitialEffect';

import { auth } from '@/backend/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';

import { showAlert } from '@/public/utils';
import { AuthContext } from '@/context/AuthContext';
import { AuthContextData } from '@/public/interfaces';

const verify = () => {
  const router: NextRouter = useRouter();
  const [sentEmail, setSentEmail] = useState<boolean>(false);
  const { currentUser, setChat } = useContext<AuthContextData>(AuthContext);

  const [counter, setCounter] = useState<number>(120); // 2 minutes;

  const sendEmail = (): void => {
    if (!currentUser) {
      showAlert({ msg: 'An error has occured' });
      router.push('/login').then(() => {
        setChat!(null);
      });
      return;
    }

    setCounter(120);
    setSentEmail(false);

    sendEmailVerification(currentUser)
      .then(() => {
        setSentEmail(true);
        alert(
          `Please verify your email address by clicking on the link in the email we just sent to you at ${currentUser.email}`
        );
      })
      .catch(() => {
        showAlert({ msg: 'An error occured while sending verification email.' });
      });
  };

  const goToLogin = () => {
    // log user out
    signOut(auth)
      .then(() => {
        router.push('/login').then(() => {
          setChat!(null);
        });
      })
      .catch(error => {
        console.log(error);
        showAlert({ msg: 'An error occured' });
      });
  };

  useNoInitialEffect(() => {
    if (!currentUser) {
      router.push('/login').then(() => {
        setChat!(null);
      });
    } else if (currentUser.emailVerified) {
      router.push('/');
    } else {
      sendEmail();
    }
  }, []);

  useEffect(() => {
    if (counter === 0 || !sentEmail) return;

    const timer = setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter, sendEmail]);

  return (
    <main className='verify'>
      <div className='container'>
        <h1>
          Verifying email address: <strong className='email'>{currentUser?.email ?? ''}</strong>
        </h1>

        <p hidden={counter === 0}>Resend email in {counter} seconds</p>

        <button disabled={counter > 0} onClick={sendEmail}>
          Resend
        </button>

        <p className='footer'>
          Already verified? Go back to <span onClick={goToLogin}>login</span>
        </p>
      </div>
    </main>
  );
};

export default verify;
