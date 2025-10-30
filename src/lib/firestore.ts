import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FirestoreService {
  private usersCollection = 'users';

  async createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const user: User = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, this.usersCollection, userData.id), user);
    return user;
  }

  async getUser(userId: string): Promise<User | null> {
    const docRef = doc(db, this.usersCollection, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  }

  async updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const userRef = doc(db, this.usersCollection, userId);
    const now = new Date();

    await updateDoc(userRef, {
      ...updates,
      updatedAt: now,
    });

    return this.getUser(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, this.usersCollection), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data() as User;
    }
    return null;
  }

  async upsertUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const existingUser = await this.getUser(userData.id);

    if (existingUser) {
      return this.updateUser(userData.id, userData) as Promise<User>;
    } else {
      return this.createUser(userData);
    }
  }
}

export const firestoreService = new FirestoreService();
