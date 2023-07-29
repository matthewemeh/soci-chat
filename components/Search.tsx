import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useContext, useEffect, useState } from 'react';

import { BiSolidUser } from 'react-icons/bi';

import { db } from '@/backend/firebase';
import {
  or,
  and,
  doc,
  Query,
  where,
  query,
  setDoc,
  getDocs,
  collection,
  QuerySnapshot,
  DocumentReference,
  getCountFromServer,
  CollectionReference,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

import { AuthContext } from '@/context/AuthContext';

import { scrollElement, showAlert } from '@/public/utils';
import { AuthContextData, ChatProps, USER } from '@/public/interfaces';

const Search = () => {
  const [user, setUser] = useState<USER>();
  const [username, setUsername] = useState<string>('');
  const [userChats, setUserChats] = useState<ChatProps[]>([]);

  const { chat, currentUser, setChat } = useContext<AuthContextData>(AuthContext);
  const currentUserID: string | undefined = currentUser?.uid;

  const getUserChats = (): void => {
    if (!currentUserID) {
      return;
    }

    // find the user id of each person the currentUser has chatted with
    const chatsRef: CollectionReference = collection(db, 'chats');
    const q: Query = query(chatsRef, where('involvedIDs', 'array-contains', currentUserID));

    getDocs(q)
      .then((querySnapshot: QuerySnapshot) => {
        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
          const chatProps = doc.data() as ChatProps;
          setUserChats([...userChats, chatProps]);
        });
      })
      .catch(error => {
        console.log(error);
        showAlert({ msg: 'An error occured while fetching your chats' });
      });
  };

  const handleSearch = async (): Promise<void> => {
    if (!currentUserID) {
      showAlert({ msg: 'An error has occured' });
      return;
    }

    try {
      const usersRef: CollectionReference = collection(db, 'users');
      const q: Query = query(
        usersRef,
        and(where('id', '!=', currentUserID), where('username', '==', username))
      );

      const snapshot = await getCountFromServer(q);
      const numberOfChats: number = snapshot.data().count;

      if (numberOfChats === 0) {
        showAlert({ msg: 'User not found!' });
      } else {
        const querySnapshot: QuerySnapshot = await getDocs(q);
        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
          setUser(doc.data() as USER);
        });
      }
    } catch (error) {
      console.log(error);
      showAlert({ msg: 'An error occured' });
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === 'Enter') {
      if (username) handleSearch();
      else showAlert({ msg: 'Please enter a username' });
    }
  };

  const handleSelect = async (uid: string): Promise<void> => {
    if (!currentUser) {
      showAlert({ msg: 'An error occured while fetching your chats' });
      return;
    }

    const selectedChat: ChatProps | undefined = userChats.find(
      ({ involvedIDs }) => involvedIDs.length === 2 && involvedIDs.includes(uid)
    );
    const selectedChatID: string = selectedChat?.id ?? '';

    if (chat?.id === selectedChatID) {
      /*
        leave this function if chat is already set to selected users' chat.
        This is to save database reads and queries
      */
      showAlert({ msg: 'Already selected' });
      return;
    }

    try {
      const chatsRef: CollectionReference = collection(db, 'chats');
      const q: Query = query(
        chatsRef,
        or(
          where('involvedIDs', '==', [uid, currentUser.uid]),
          where('involvedIDs', '==', [currentUser.uid, uid])
        )
      );

      // check if currentUser has chatted with the clicked user before
      const snapshot = await getCountFromServer(q);
      const numberOfChats: number = snapshot.data().count;

      if (numberOfChats === 0) {
        /*
        if the currentUser hasn't chatted with clicked user before,
        then create a new chat document for their chats...
      */
        const newID: string = uuidv4();
        const chatsDoc: DocumentReference = doc(db, 'chats', newID);

        const newChat: ChatProps = {
          id: newID,
          messages: [],
          involvedIDs: [currentUser.uid, uid],
        };
        setDoc(chatsDoc, newChat)
          .then(() => setChat!({ ...newChat }))
          .catch(error => {
            console.log(error);
            showAlert({ msg: 'Something went wrong' });
          });
      } else {
        /*
        ...else, access their chat documents and set the current chat
        using the setChat useState handler
      */
        const querySnapshot: QuerySnapshot = await getDocs(q);
        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
          setChat!({ ...(doc.data() as ChatProps) });
        });
      }
    } catch (error) {
      console.log(error);
      showAlert({ msg: 'An error occured while fetching your chats' });
    }

    scrollElement({ targetSelector: '.messages', toBottom: true, delay: 300 });
  };

  useEffect(getUserChats, []);

  return (
    <div className='search'>
      <div className='searchForm'>
        <input
          type='text'
          spellCheck='false'
          autoComplete='false'
          onKeyDown={handleKey}
          placeholder='Find a user'
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      {user && (
        <div className='userChat' onClick={() => handleSelect(user.id)}>
          {user.photoURL ? (
            <Image src={user.photoURL} alt='' width={50} height={50} priority />
          ) : (
            <BiSolidUser />
          )}
          <div className='userChatInfo'>
            <span>{user.username}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
