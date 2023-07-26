import Image from 'next/image';
import { useMemo, useContext } from 'react';

import { AuthContext } from '@/context/AuthContext';

import { getDateProps } from '@/public/utils';
import { DateProps, Message, USER } from '@/public/interfaces';

import { BiSolidUser } from 'react-icons/bi';

interface Props {
  message: Message;
}

const Message: React.FC<Props> = ({ message }) => {
  const { date, senderID, files, messageContent } = message;

  // get chat display properties
  const { chat: chats, users, currentUser } = useContext(AuthContext);
  const currentUserID: string = currentUser?.uid ?? '';
  const involvedIDs: string[] = chats?.involvedIDs ?? [];

  const chatterID: string | undefined = involvedIDs.find((id: string) => id !== currentUserID);

  const chatterData: USER | undefined = useMemo(
    () => users?.find(({ id }) => id === chatterID),
    [chatterID]
  );
  const currentUserData: USER | undefined = useMemo(
    () => users?.find(({ id }) => id === currentUserID),
    [currentUserID]
  );

  const chatterPhotoURL: string | undefined = chatterData?.photoURL;
  const currentUserPhotoURL: string | undefined = currentUserData?.photoURL;

  // get time properties
  const dateProps: DateProps = getDateProps(date);

  const justNow: boolean = useMemo(() => {
    const now: number = Date.now();
    const messageDate: number = new Date(date).getTime();
    const oneMinute = 60_000; // in milliseconds

    return now - messageDate <= oneMinute;
  }, []);

  const isOwner: boolean = useMemo(() => senderID === currentUser?.uid, []);

  return (
    <div className={`message ${isOwner && 'owner'}`}>
      <div className='messageInfo'>
        {currentUserPhotoURL && chatterPhotoURL ? (
          <Image
            alt=''
            priority
            width={40}
            height={40}
            src={isOwner ? currentUserPhotoURL : chatterPhotoURL}
          />
        ) : (
          <BiSolidUser />
        )}
        <span>{justNow ? 'Just now' : `${dateProps.hour24}:${dateProps.minutes}`}</span>
      </div>

      <div className='messageContent'>
        {messageContent.includes('text') && <p>{message.message}</p>}
        {files.map(
          ({ downloadURL, fileType }, index) =>
            fileType === 'image' && (
              <Image
                alt=''
                priority
                key={index}
                width={100}
                height={100}
                src={downloadURL}
                style={{ objectFit: 'contain' }}
              />
            )
        )}
      </div>
    </div>
  );
};

export default Message;
