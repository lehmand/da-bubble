import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Firestore, doc, getDocs, getDoc, collection, query, where } from '@angular/fire/firestore';
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';

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

  loginFailed = false;
  loading = false; // Optional: to show a loading spinner during login
  userService = inject(UserService);
  firestore = inject(Firestore);
  // auth = inject(Auth);
  router = inject(Router);

  constructor() { }

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
