import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {
  Firestore,
  getDocs,
  collection,
  query,
  where,
  addDoc
} from '@angular/fire/firestore';
import {
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.class';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: '',
  };
  loginFailed = false;
  loading = false; // Optional: to show a loading spinner during login
  userService = inject(UserService);
  firestore = inject(Firestore);
  // auth = inject(Auth);
  router = inject(Router);
  auth = inject(AuthService);
  emailLoginFailed = false;
  formFailed = false;
  guestUser: User = new User();

  constructor() {
  }

  ngOnInit() {

  }

  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const emailExists = await this.proofMail(this.loginData.email);
      if (!emailExists) {
        this.emailLoginFailed = true;
        return;
      }
      await this.logIn();
    }
  }

  async logIn() {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        this.loginData.email,
        this.loginData.password
      );
      const user = userCredential.user;
      const userID = await this.userDocId(user.uid);
      this.router.navigate(['/welcome', userID]);
    } catch (error) {
      this.formFailed = true;
    }
  }

  async proofMail(email: string): Promise<boolean> {
    const docRef = collection(this.firestore, 'users');
    const q = query(docRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async userDocId(uid: string) {
    const docRef = collection(this.firestore, 'users');
    const q = query(docRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.id;
    }
    return null;
  }

  onEmailChange() {
    this.emailLoginFailed = false;
  }

  onPasswordChange() {
    this.formFailed = false;
  }

  async guestLogin() {
    const guestDocId = await this.userDocId('xx-guest-2024'); 
    if (guestDocId) {
      this.router.navigate(['/welcome', guestDocId]);
    } else {
      this.guestUser = new User({
        uid: 'xx-guest-2024',
        name: 'Guest',
        email: 'guest@account.de',
        picture: './assets/img/picture_frame.png',
      });
      const docRef = await this.addUserToFirestore(this.guestUser);
      this.router.navigate(['/welcome', docRef.id]);
    }
  }


  async addUserToFirestore(user: User) {
    const usersCollection = collection(this.firestore, 'users');
    const docRef = await addDoc(usersCollection, user.toJSON()); 
    return docRef;
  }

  googleLogIn() {
    this.auth.googleLogIn();
  }
}
