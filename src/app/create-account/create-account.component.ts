import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import {
  Firestore,
  collection,
  addDoc,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { UserService } from '../services/user.service';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    AvatarComponent,
    RouterModule,
    UserComponent,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent implements OnInit {
  isDisabled: boolean = true;
  isHovered: boolean = false;
  isClicked: boolean = false;
  isChecked: boolean = false;

  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  userData = {
    name: '',
    email: '',
    password: '',
    privacyPolicy: false,
  };
  newUser = new User();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
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
    const docRef = await addDoc(usersCollection, this.userData);
    this.router.navigate(['/avatar', docRef.id]);
  }

  toggleClicked() {
    this.isClicked = !this.isClicked;
  }

  toggleChecked() {
    this.isChecked = !this.isChecked;
  }

  toggleHover() {
    this.isHovered = !this.isHovered;
  }
}
