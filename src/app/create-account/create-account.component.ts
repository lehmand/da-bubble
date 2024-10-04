import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import {
  Firestore,
  collection,
  DocumentData,
  onSnapshot,
  QuerySnapshot, addDoc
} from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AvatarComponent,
    RouterModule
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent implements OnInit {
  isHovered: boolean = false;
  isClicked: boolean = false;
  isChecked: boolean = false;

  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  private userService = inject(UserService); 
  unsub?: () => void;
  user: User = new User();
  allUsers: User[] = [];
  userData = {
    name: '',
    email: '',
    password: '',
    privacyPolicy: false,
  };
  constructor() {}

  ngOnInit(): void {
    //this.startListeningNewUsers();
  }

  ngOnDestroy() {
    if (this.unsub) {
      this.unsub();
    }
  }

  /* Für Veränderungen wenn 'neue User' in eine Liste gerendert werden müssen mit AllUsers*/
  startListeningNewUsers() {
    const newUsersRef = collection(this.firestore, 'users');
    this.unsub = onSnapshot(
      newUsersRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const updatedUsers: User[] = [];
        snapshot.forEach((doc) => {
          const userData = doc.data();
          const newUser = new User(userData);
          updatedUsers.push(newUser);
        });
        this.allUsers = updatedUsers;
      }
    );
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.addUser();
    } else {
      console.error('Fehler beim Erstellen des Kontakts:');
    }
  }

  async addUser() {
    const usersCollection = collection(this.firestore, 'users');
    const newUser = new User({
        displayName: this.userData.name,
        email: this.userData.email,
        password: this.userData.password
    });
    const docRef = await addDoc(usersCollection, newUser.toJSON());
    this.userService.setCurrentUser(newUser);
    this.router.navigate(['/', 'avatar'])
}

  toggleClicked() {
    this.isClicked = !this.isClicked;
  }

  toggleChecked() {
    this.isChecked = !this.isChecked;
    this.userData.privacyPolicy = this.isChecked;
  }

  toggleHover() {
    this.isHovered = !this.isHovered;
  }
}
