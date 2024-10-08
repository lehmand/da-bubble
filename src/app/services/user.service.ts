import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: string | null = null;

  constructor(private firestore: Firestore) {}

  setCurrentUser(userId: string) {
    this.currentUser = userId;
    console.log('cu',this.currentUser);
  }

  getCurrentUser(): string | null {
    return this.currentUser;
  }

  async getUserDataById(userId: string) {
    const userRef = doc(this.firestore, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
     const Userdata= userSnapshot.data();
     console.log('currentUserData is', Userdata);
     return Userdata;
    } else {
      return null;
    }
  }
}
