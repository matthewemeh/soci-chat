import Link from 'next/link';
import { useRef } from 'react';
import { NextRouter, useRouter } from 'next/router';

import { auth, storage, db } from '@/backend/firebase';
import { DocumentReference, doc, setDoc } from 'firebase/firestore';
import { UserCredential, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, uploadBytes, ref, StorageReference, UploadResult } from 'firebase/storage';

import { LuImagePlus } from 'react-icons/lu';

import { USER } from '@/public/interfaces';
import { showAlert } from '@/public/utils';

const Register = () => {
  const router: NextRouter = useRouter();

  const fileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);

  const register = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const file: File = fileRef.current!.files![0];
    const email: string = emailRef.current!.value;
    const password: string = passwordRef.current!.value;
    const displayName: string = displayNameRef.current!.value;
    const emailPattern: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (displayName.length < 2) {
      showAlert({ msg: 'Display name must be at least 2 characters long' });
      return;
    } else if (!emailPattern.test(email)) {
      showAlert({ msg: 'Please enter a valid email address' });
      return;
    } else if (password.length < 8) {
      showAlert({ msg: 'Password should be at least 8 characters long' });
      return;
    } else if (!file) {
      showAlert({ msg: 'Please choose an avatar' });
      return;
    }

    try {
      const res: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef: StorageReference = ref(storage, `users/${res.user.uid}`);

      const snapshot: UploadResult = await uploadBytes(storageRef, file);

      const photoURL: string = await getDownloadURL(snapshot.ref);

      updateProfile(res.user, { displayName, photoURL });

      const newUser: USER = {
        email,
        photoURL,
        id: res.user.uid,
        username: displayName,
      };

      const usersRef: DocumentReference = doc(db, 'users', res.user.uid);

      setDoc(usersRef, newUser).then(() => {
        showAlert({ msg: 'Sign up successful' });
        router.push('/login');
      });
    } catch (error) {
      showAlert({ msg: 'Something went wrong' });
      console.log(error);
    }
  };

  return (
    <main className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>Soci Chat</span>
        <span className='title'>Register</span>

        <form onSubmit={register}>
          <input
            ref={displayNameRef}
            type='text'
            spellCheck='false'
            autoComplete='false'
            placeholder='display name'
          />
          <input
            ref={emailRef}
            type='email'
            inputMode='email'
            spellCheck='false'
            placeholder='email'
            autoComplete='false'
          />
          <input ref={passwordRef} type='password' autoComplete='false' placeholder='password' />
          <input
            hidden
            type='file'
            id='avatar'
            ref={fileRef}
            accept='image/png, image/jpg, image/jpeg'
          />
          <label htmlFor='avatar'>
            <LuImagePlus />
            <span>Choose an avatar</span>
          </label>
          <button>Sign Up</button>
        </form>

        <p>
          You have an account? <Link href='/login'>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
