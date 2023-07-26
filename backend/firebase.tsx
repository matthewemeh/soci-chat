import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { FirebaseApp, initializeApp, setLogLevel } from 'firebase/app';

import { FirebaseConfig } from '../public/interfaces';

setLogLevel('silent');

const firebaseConfig: FirebaseConfig = {
  projectId: 'soci-chat-bd77e',
  messagingSenderId: '916940222268',
  storageBucket: 'soci-chat-bd77e.appspot.com',
  authDomain: 'soci-chat-bd77e.firebaseapp.com',
  apiKey: 'AIzaSyDtgwRohvZQfzftLb48JDpJTcCX52zeF-M',
  appId: '1:916940222268:web:c1ed57e29e5104f5763839',
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
