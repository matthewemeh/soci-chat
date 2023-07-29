import { useContext, useMemo } from 'react';

import { FaUserPlus } from 'react-icons/fa';
import { BiSolidVideo } from 'react-icons/bi';
import { FiMoreHorizontal } from 'react-icons/fi';

import Input from './Input';
import Messages from './Messages';

import { AuthContext } from '@/context/AuthContext';
import { Message, USER } from '@/public/interfaces';

/*
  this component is the right side of the container,
  which contains the display of the messages, input field, send button,
  and the chat navbar which contains the chatter's username and those icons
*/
const Chat = () => {
  const { chat, users, currentUser } = useContext(AuthContext);
  const currentUserID: string = currentUser?.uid ?? '';
  const involvedIDs: string[] = chat?.involvedIDs ?? [];

  const chatterID: string | undefined = involvedIDs.find((id: string) => id !== currentUserID);
  const chatterData: USER | undefined = useMemo(
    () => users?.find(({ id }) => id === chatterID),
    [chatterID]
  );

  const chatterUsername: string = chatterData?.username ?? '';
  const messages: Message[] = chat?.messages ?? [];
  const chatID: string = chat?.id ?? '';

  return (
    <div className='chat'>
      <div className='chatInfo'>
        <span>{chatterUsername}</span>

        <div className='chatIcons'>
          <BiSolidVideo />
          <FaUserPlus />
          <FiMoreHorizontal />
        </div>
      </div>

      <Messages messages={messages} />
      <Input chatID={chatID} />
    </div>
  );
};

export default Chat;
