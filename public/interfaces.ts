import { User } from 'firebase/auth';
import { AmOrPm, MessageType } from './types';

export interface AlertProps {
  msg: string;
  zIndex?: string;
  bgColor?: string;
  duration?: number;
  textColor?: string;
}

export interface ScrollElementProps {
  top?: number;
  left?: number;
  delay?: number;
  toTop?: boolean;
  toLeft?: boolean;
  toRight?: boolean;
  toBottom?: boolean;
  targetSelector: string;
  behavior?: globalThis.ScrollBehavior;
}

export interface USER {
  id: string;
  email: string;
  photoURL: string;
  username: string;
}

export interface FileInfo {
  name: string;
  fileType: string;
  extension: string;
  downloadURL: string;
}

export interface Message {
  id: string;
  date: number;
  message: string;
  senderID: string;
  files: FileInfo[];
  readByIDs: string[];
  messageContent: MessageType[];
}

export interface ChatProps {
  id: string;
  messages: Message[];
  involvedIDs: string[];
}

export interface AuthContextData {
  users?: USER[];
  chat?: ChatProps | null;
  currentUser?: User | null;
  setChat?: React.Dispatch<React.SetStateAction<ChatProps | null>>;
}

export interface FirebaseConfig {
  appId: string;
  apiKey: string;
  projectId: string;
  authDomain: string;
  storageBucket: string;
  messagingSenderId: string;
}

export interface DateProps {
  gmt: string;
  year: string;
  hour24: string;
  hour12: string;
  time24: string;
  minutes: string;
  seconds: string;
  am_or_pm: AmOrPm;
  monthDate: string;
  shortMonthName: string;
  shortDayOfWeek: string;
}
