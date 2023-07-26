import Link from 'next/link';
import { useRef } from 'react';
import { NextRouter, useRouter } from 'next/router';

import { auth } from '@/backend/firebase';
import { UserCredential, signInWithEmailAndPassword } from 'firebase/auth';

import { showAlert } from '@/public/utils';

const Login = () => {
  const router: NextRouter = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const login = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const email: string = emailRef.current!.value;
    const password: string = passwordRef.current!.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        showAlert({ msg: `Welcome, ${userCredential.user.displayName}` });
        router.push('/');
      })
      .catch(error => {
        showAlert({ msg: 'Something went wrong' });
        console.log(error);
      });
  };

  return (
    <main className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>Soci Chat</span>
        <span className='title'>Login</span>

        <form onSubmit={login}>
          <input
            ref={emailRef}
            type='email'
            inputMode='email'
            spellCheck='false'
            placeholder='email'
            autoComplete='false'
          />
          <input ref={passwordRef} type='password' autoComplete='false' placeholder='password' />
          <Link
            style={{ fontSize: '15px', textAlign: 'right', textDecoration: 'underline' }}
            href='/forgot-password'
          >
            Forgot password
          </Link>
          <button>Sign in</button>
        </form>

        <p>
          Don&apos;t have an account? <Link href='/register'>Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
