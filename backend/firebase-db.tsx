import { db } from './firebase';
import {
  Firestore,
  onSnapshot,
  collection,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';

export const fetchData = (
  dbName: string,
  setState: React.Dispatch<React.SetStateAction<any[]>>,
  database?: Firestore
): void => {
  const dataRef: CollectionReference = collection(database || db, dbName);

  onSnapshot(dataRef, (snapshot: QuerySnapshot) => {
    setState(snapshot.docs.map(doc => doc.data()));
  });
};
