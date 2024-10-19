import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  QuerySnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: string | null = null;
  user: User = new User();
  userID: any;
  unsub?: () => void;

  constructor(private firestore: Firestore) {}

  setCurrentUser(userId: string) {
    this.currentUser = userId;
  }

  getCurrentUser(): string | null {
    return this.currentUser;
  }

  async getUser(fireId: string) {
    const userRef = doc(this.firestore, 'users', fireId);
    await updateDoc(userRef, { fireId: fireId });
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as User;
      this.user = userData;
      console.log('cu', this.user);
      return this.user;
    } else return null;
  }

  observingUserChanges(userID: string, callback: (user: User) => void) {
    const newUsersRef = collection(this.firestore, 'users');
    this.unsub = onSnapshot(
      newUsersRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach((docSnapshot) => {
          const userData = docSnapshot.data();
          const snapID = docSnapshot.id;
          if (snapID === userID) {
            const updatedUser = new User(userData, userID);
            callback(updatedUser); 
          }
        });
      }
    );
}}
