import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ResetPasswordComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: '',
  };
  emailLoginFailed = false;
  formFailed = false;
  userService = inject(UserService);
  userId: string | null = null;
  currentUser: any = {};
  route = inject(ActivatedRoute);
  router: Router = inject(Router);
  firestore = inject(Firestore);
  existingUser: any = {};

  constructor() {}

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
    }
  }
}
