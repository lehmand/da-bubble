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
import { UserComponent } from '../user/user.component';
import { AuthService } from '../services/auth.service';

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
  isHovered: boolean = false;
  isClicked: boolean = false;
  isChecked: boolean = false;
  privacyPolicy: boolean = false;

  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  user: User = new User();

  constructor(private auth: AuthService) {}

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
    const docRef = await addDoc(usersCollection, this.user.toJSON());
    this.auth.user = this.user
    this.router.navigate(['/avatar', docRef.id]);
  }

  toggleClicked() {
    this.isClicked = !this.isClicked;
  }

  toggleChecked() {
    this.isChecked = !this.isChecked;
    this.privacyPolicy = this.isChecked;
  }

  toggleHover() {
    this.isHovered = !this.isHovered;
  }
}
