import { v4 as uuidv4 } from 'uuid';
import { useContext, useRef } from 'react';

import { LuImagePlus } from 'react-icons/lu';
import { MdAttachFile } from 'react-icons/md';

import { db, storage } from '@/backend/firebase';
import { AuthContext } from '@/context/AuthContext';
import { DocumentReference, doc, setDoc } from 'firebase/firestore';

import { scrollElement, showAlert } from '@/public/utils';
import { AuthContextData, Message } from '@/public/interfaces';
import { StorageReference, UploadResult, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface Props {
  chatID: string;
}

const Input: React.FC<Props> = ({ chatID }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);

  const { chat, setChat, currentUser } = useContext<AuthContextData>(AuthContext);
  const currentUserID: string = currentUser?.uid ?? '';

  const sendMessage = (
    messageID: string,
    date: number,
    message: string,
    chatsRef: DocumentReference
  ): void => {
    const newMessage: Message = {
      date,
      message,
      files: [],
      id: messageID,
      senderID: currentUserID,
      messageContent: ['text'],
      readByIDs: [currentUserID],
    };

    const messagePayload: { messages: Message[] } = {
      messages: [...chat!.messages, newMessage],
    };

    // update chats on database...
    setDoc(chatsRef, messagePayload, { merge: true })
      .then(() => {
        // ...then clear message input and update chats locally...
        messageRef.current!.value = '';
        setChat!({ ...chat!, messages: messagePayload.messages });

        // ...finally scroll chats to the bottom
        scrollElement({ targetSelector: '.messages', toBottom: true, delay: 300 });
      })
      .catch(error => {
        console.log(error);
        showAlert({ msg: 'An error has occured' });
      });
  };

  const sendFile = async (
    date: number,
    file: File,
    messageID: string,
    chatsRef: DocumentReference
  ): Promise<void> => {
    const { name, type } = file;
    const [fileType, extension] = type.split('/');

    try {
      const imageRef: StorageReference = ref(storage, `chats/${chatID}/${messageID}`);

      const snapshot: UploadResult = await uploadBytes(imageRef, file);

      const downloadURL: string = await getDownloadURL(snapshot.ref);

      const newMessage: Message = {
        date,
        message: '',
        files: [
          {
            name,
            downloadURL,
            fileType: fileType ?? 'none',
            extension: extension ?? 'none',
          },
        ],
        id: messageID,
        senderID: currentUserID,
        messageContent: ['file'],
        readByIDs: [currentUserID],
      };

      const messagePayload: { messages: Message[] } = {
        messages: [...chat!.messages, newMessage],
      };

      // update chats on database...
      setDoc(chatsRef, messagePayload, { merge: true })
        .then(() => {
          // ...then clear file input and update chats locally...
          fileRef.current!.value = '';
          setChat!({ ...chat!, messages: messagePayload.messages });

          // ...finally scroll chats to the bottom
          scrollElement({ targetSelector: '.messages', toBottom: true, delay: 300 });
        })
        .catch(error => {
          console.log(error);
          showAlert({ msg: 'An error has occured' });
        });
    } catch (error) {
      console.log(error);
      showAlert({ msg: 'An error has occured' });
    }
  };

  const sendMessageAndFile = async (
    date: number,
    file: File,
    messageID: string,
    message: string,
    chatsRef: DocumentReference
  ): Promise<void> => {
    const { name, type } = file;
    const [fileType, extension] = type.split('/');

    try {
      const imageRef: StorageReference = ref(storage, `chats/${chatID}/${messageID}`);

      const snapshot: UploadResult = await uploadBytes(imageRef, file);

      const downloadURL: string = await getDownloadURL(snapshot.ref);

      const newMessage: Message = {
        date,
        message,
        files: [
          {
            name,
            downloadURL,
            fileType: fileType ?? 'none',
            extension: extension ?? 'none',
          },
        ],
        id: messageID,
        senderID: currentUserID,
        messageContent: ['file', 'text'],
        readByIDs: [currentUserID],
      };

      const messagePayload: { messages: Message[] } = {
        messages: [...chat!.messages, newMessage],
      };

      // update chats on database...
      setDoc(chatsRef, messagePayload, { merge: true })
        .then(() => {
          // ...then clear message and file input, and update chats locally...
          fileRef.current!.value = '';
          messageRef.current!.value = '';
          setChat!({ ...chat!, messages: messagePayload.messages });

          // ...finally scroll chats to the bottom
          scrollElement({ targetSelector: '.messages', toBottom: true, delay: 300 });
        })
        .catch(error => {
          console.log(error);
          showAlert({ msg: 'An error has occured' });
        });
    } catch (error) {
      console.log(error);
      showAlert({ msg: 'An error has occured' });
    }
  };

  const send = (): void => {
    if (!chat || !currentUserID) {
      showAlert({ msg: 'An error occured while sending your message' });
      return;
    }

    const newID: string = uuidv4();
    const date: number = Date.now();
    const file: File = fileRef.current!.files![0];
    const message: string = messageRef.current!.value.trim();
    const chatsRef: DocumentReference = doc(db, 'chats', chatID);

    if (message && !file) {
      sendMessage(newID, date, message, chatsRef);
    } else if (!message && file) {
      sendFile(date, file, newID, chatsRef);
    } else if (message && file) {
      sendMessageAndFile(date, file, newID, message, chatsRef);
    } else {
      showAlert({ msg: 'Please enter a message or a file' });
    }
  };

  return (
    <div className='input'>
      <input ref={messageRef} type='text' placeholder='Send a message...' />

      <div className='send'>
        <MdAttachFile />

        <input ref={fileRef} type='file' id='file' hidden />

        <label htmlFor='file'>
          <LuImagePlus />
        </label>

        <button onClick={send}>Send</button>
      </div>
    </div>
  );
};

export default Input;
