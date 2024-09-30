import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private auth = getAuth(); 
  constructor() {}

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user; // Gibt den Benutzer zurück
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      throw error; // Fehler weitergeben
    }
  }

  // Weitere Methoden...
}
