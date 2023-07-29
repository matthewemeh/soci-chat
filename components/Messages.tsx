import Message from './Message';
import { Message as MessageProps } from '@/public/interfaces';

interface Props {
  messages: MessageProps[];
}

const Messages: React.FC<Props> = ({ messages }) => {
  return (
    <div className='messages'>
      {messages.map((message: MessageProps) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Messages;
