import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { newUser } from '../interfaces/user.class';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(); //Authent-Instanz Firebase
  private firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async getCurrentUser() {
    const currentUser = this.auth.currentUser; // Holt den aktuell angemeldeten Benutzer
    console.log('Aktuell angemeldeter Benutzer:', currentUser);
    return currentUser;
  }

  async registerUser(userData: newUser) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      userData.userMail,
      userData.password
    );
    await this.saveUserData(userCredential.user.uid, userData);
    return userCredential;
  }

  private async saveUserData(userId: string, userData: newUser) {
    const userRef = doc(this.firestore, `users/${userId}`);
    await setDoc(userRef, {
      email: userData.userMail,
      name: userData.displayName,
      userId: userId,
    });
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // ID  authentifizierter Benutzers
      const uid = userCredential.user.uid;

      //  Benutzerinformationen aus Firestore abrufen
      const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Benutzerdaten:', userData);
      } else {
        console.log('Benutzer nicht gefunden in Firestore.');
      }

      return userCredential.user; // Gibt den Benutzer zurück
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      throw error; // Fehler weitergeben
    }
  }
}
