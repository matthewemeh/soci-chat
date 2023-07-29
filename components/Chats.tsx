import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';

import { AuthContext } from '@/context/AuthContext';
import {
  or,
  Query,
  where,
  query,
  getDocs,
  collection,
  QuerySnapshot,
  CollectionReference,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/backend/firebase';

import { scrollElement, showAlert } from '@/public/utils';
import { AuthContextData, ChatProps, USER } from '@/public/interfaces';

/*
  this component is the left side of the container,
  which contains the display of the users's chats
*/
const Chats = () => {
  const [userChats, setUserChats] = useState<ChatProps[]>([]);

  const { chat, currentUser, setChat, users } = useContext<AuthContextData>(AuthContext);
  const currentUserID: string = currentUser?.uid ?? '';

  const getUserChats = (): void => {
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

  const handleSelect = async (uid: string, chatID: string): Promise<void> => {
    if (!currentUser) {
      showAlert({ msg: 'An error occured while fetching your chats' });
      return;
    }

    if (chat?.id === chatID) {
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

      const querySnapshot: QuerySnapshot = await getDocs(q);
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        setChat!({ ...(doc.data() as ChatProps) });
      });
    } catch (error) {
      console.log(error);
      showAlert({ msg: 'An error occured while fetching your chats' });
    }

    scrollElement({ targetSelector: '.messages', toBottom: true, delay: 300 });
  };

  useEffect(getUserChats, []);

  return (
    <div className='chats'>
      {userChats.map(({ id, involvedIDs, messages }) => {
        const lastMessage: string = messages.slice(-1)[0]?.message ?? '';
        const chatterID: string | undefined = involvedIDs.find(
          (id: string) => id !== currentUserID
        );
        const chatterData: USER | undefined = users?.find(({ id }) => id === chatterID);

        return (
          chatterData && (
            <div key={id} className='userChat' onClick={() => handleSelect(chatterData.id, id)}>
              <Image src={chatterData.photoURL} alt='' width={50} height={50} priority />

              <div className='userChatInfo'>
                <span>{chatterData.username}</span>
                <p>{lastMessage}</p>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default Chats;
