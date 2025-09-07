import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';

export interface ImageRecord {
  id?: string;
  userId: string;
  prompt: string;
  storagePath: string;
  downloadUrl: string;
  createdAt: number;
}

const IMAGES_COLLECTION = 'images';

export async function saveImage(imageData: ImageRecord) {
  try {
    const docRef = await addDoc(collection(db, IMAGES_COLLECTION), imageData);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not save image metadata to Firestore.');
  }
}

export async function getImages(userId: string) {
  const q = query(collection(db, IMAGES_COLLECTION), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const images: ImageRecord[] = [];
  querySnapshot.forEach((doc) => {
    images.push({ id: doc.id, ...doc.data() } as ImageRecord);
  });
  return images;
}

export function streamImages(userId: string, callback: (images: ImageRecord[]) => void): Unsubscribe {
    const q = query(collection(db, IMAGES_COLLECTION), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const images: ImageRecord[] = [];
        querySnapshot.forEach((doc) => {
            images.push({ id: doc.id, ...doc.data() } as ImageRecord);
        });
        callback(images);
    });
    return unsubscribe;
}
