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
  doc,
} from '@angular/fire/firestore';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { updateDoc } from '@firebase/firestore';

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
  auth = inject(AuthService);
  router = inject(Router);
  emailLoginFailed = false;
  formFailed = false;
 

  constructor() {}

  ngOnInit() {}

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
      this.auth.currentUser = auth.currentUser
      this.router.navigate(['/welcome', userID]);
      if (userID) {
        this.auth.updateStatus(userID, 'online');
      }
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

  guestLogin() {
    this.auth.SignGuestIn();
  }


  googleLogIn() {
    this.auth.googleLogIn();
  }
}
