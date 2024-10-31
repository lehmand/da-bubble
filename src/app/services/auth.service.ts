import { Injectable, inject } from '@angular/core';
import { getAuth, signInWithPopup, signOut  } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { User } from '../models/user.class';
import { Firestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
  user: User = new User();
  firestore = inject(Firestore);
  currentUser: any;

  constructor(private sanitizer: DomSanitizer) {}


  googleLogIn() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        this.user = new User({
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          picture: result.user.photoURL
        });
        await this.addGoogleUserToFirestore(this.user);
          this.router.navigate(['/welcome', this.user.uid]);
      })
      .catch((error) => {
        console.error('fehler beim Google log:', error);
      });
  }

  async addGoogleUserToFirestore(user: User) {
    const userRef = doc(this.firestore, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {  
      await setDoc(userRef, user.toJSON());
    } else {
      console.log('Benutzer existiert bereits in der Datenbank.');
    }
  }
  

  logOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Signed Out');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error('Fehler beim Abmelden:', error);
      });
  }
}
