import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
<<<<<<< HEAD
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Firestore, doc, getDocs, getDoc, collection, query, where } from '@angular/fire/firestore';
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
=======
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import {
  Firestore,
  getDocs,
  query,
  where,
  collection,
} from '@angular/fire/firestore';
>>>>>>> feature/loginData

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginData = {
    email: '',
    password: '',
  };
<<<<<<< HEAD

  loginFailed = false;
  loading = false; // Optional: to show a loading spinner during login
  userService = inject(UserService);
  firestore = inject(Firestore);
  // auth = inject(Auth);
  router = inject(Router);
=======
  emailLoginFailed = false;
  formFailed = false;
  userService = inject(UserService);
  userId: string | null = null;
  currentUser: any = {};
  route = inject(ActivatedRoute);
  router: Router = inject(Router);
  firestore = inject(Firestore);
  existingUser: any = {};
>>>>>>> feature/loginData

  constructor() { }

<<<<<<< HEAD
  ngOnInit() {

  }
  //  async getD(){
  //   const querySnapshot = await getDocs(collection(this.firestore, "users"));
  //   querySnapshot.forEach((doc) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     console.log(doc.id, " => ", doc.data());
  //   });
  //   }

  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.loginData.email,
          this.loginData.password
        );
        const user = userCredential.user;
        const userID = await this.userDocId(user.uid)
        console.log('Login successful:', user.uid);
        this.router.navigate(['/welcome', userID]);
      } catch (error) {
        console.error('Error during login:', error);
      }
=======
  async ngOnInit() {
    this.userId = this.userService.getCurrentUser();
    if (this.userId) {
      this.currentUser = await this.userService.getUserDataById(this.userId);
    } else {
      return;
    }
  }

  async checkIfUserExist() {
    const usersCollection = collection(this.firestore, 'users');
    const querySearch = query(
      usersCollection,
      where('email', '==', this.loginData.email)
    );
    const querySnapshot = await getDocs(querySearch);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      this.existingUser = doc.data();
      this.currentUser = { ...this.existingUser, userId: doc.id };
      this.userService.setCurrentUser(this.currentUser.userId);
      return true;
    } else {
     return false;
    }
  }


  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const userExists = await this.checkIfUserExist(); 
      await this.proofLoginData(userExists); 
    }
  }

  async proofLoginData(userExists: boolean) {
    const emailIsValid = userExists && this.loginData.email === this.currentUser?.email;
    const passwordIsValid = userExists && this.loginData.password === this.currentUser?.password;

  
    if (userExists) {
      if (emailIsValid && passwordIsValid) {
        this.router.navigate(['/welcome']);
      } else {
        if (!emailIsValid) {
          this.emailLoginFailed = true; 
        }
        if (!passwordIsValid) {
          this.formFailed = true; 
        }
      }
    } else {
      this.emailLoginFailed = true; 
      this.formFailed = false;
    }
  }

  onEmailChange() {
    if (!this.loginData.email) {
      this.emailLoginFailed = false;
>>>>>>> feature/loginData
    }
  }

  async userDocId(uid: string) {
    const docRef = collection(this.firestore, "users",);
    const q = query(docRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        return doc.id
      })
    }
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.id;
    }
    return null;
  }
}
