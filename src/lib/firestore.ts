import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';

export interface ImageRecord {
  id?: string;
  userId: string;
  prompt: string;
  imageData: string; // Changed from storagePath and downloadUrl
  createdAt: number;
}

const IMAGES_COLLECTION = 'images';

export async function saveImage(imageData: Omit<ImageRecord, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, IMAGES_COLLECTION), imageData);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not save image metadata to Firestore.');
  }
}

export function streamImages(userId: string, callback: (images: ImageRecord[]) => void): Unsubscribe {
    const q = query(collection(db, IMAGES_COLLECTION), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const images: ImageRecord[] = [];
        querySnapshot.forEach((doc) => {
            images.push({ id: doc.id, ...doc.data() } as ImageRecord);
        });
        callback(images);
    }, (error) => {
        console.error("Error streaming images: ", error);
        callback([]);
    });
    return unsubscribe;
}
