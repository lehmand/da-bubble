import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: string | null = null;
  user: User = new User();

  constructor(private firestore: Firestore) {}

  setCurrentUser(userId: string) {
    this.currentUser = userId;
    console.log('cu', this.currentUser);
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
}
