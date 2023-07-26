import { useRef } from 'react';

import { auth } from '@/backend/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

import { showAlert } from '@/public/utils';
import Link from 'next/link';

const ForgotPassword = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  const resetPassword = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const email: string = emailRef.current!.value;
    const emailPattern: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailPattern.test(email)) {
      showAlert({ msg: 'Please enter a valid email address' });
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert(`A password reset link has been sent to your email: ${email}`);
      })
      .catch(error => {
        console.log(error);
        showAlert({ msg: 'Something went wrong. Please try again' });
      });
  };

  return (
    <main className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>Soci Chat</span>
        <span className='title'>Forgot Password</span>

        <form onSubmit={resetPassword}>
          <input
            type='email'
            ref={emailRef}
            inputMode='email'
            spellCheck='false'
            autoComplete='false'
            placeholder='Enter your email'
            style={{ textAlign: 'center' }}
          />
          <button>Reset password</button>
        </form>

        <p>
          Go back to <Link href='/login'>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;
