import { Injectable, inject } from '@angular/core';
import { getAuth, signInWithPopup, signOut  } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  router = inject(Router);

  googleLogIn() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('Benutzer eingeloggt:', user.uid);
        this.router.navigate(['/welcome', user.uid]);
      })
      .catch((error) => {
        console.error('Fehler', error);
      });
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
