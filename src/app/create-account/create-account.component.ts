import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { UserComponent } from '../user/user.component';
import { getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';

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

  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  auth = getAuth();
  userData = {
    name: '',
    email: '',
    password: '',
    privacyPolicy: false,
  };
  newUser: User = new User();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.createAuthUser(this.userData.email, this.userData.password);
    }
  }

  async createAuthUser(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const authUser = userCredential.user;

    this.newUser = new User({
      uid: authUser.uid,
      name: this.userData.name,
      email: authUser.email || email,
      picture: '',
      password: '',
      status: 'offline'
      
    });
    const docRef = await this.addUserToFirestore(this.newUser,);
    this.router.navigate(['/avatar', docRef.id]);
    console.log(this.newUser)
  }

  async addUserToFirestore(user: User) {
    const usersCollection = collection(this.firestore, 'users');
    const docRef = await addDoc(usersCollection, user.toJSON()); 
    console.log(
      'Benutzer in Firestore hinzugefügt mit Dokument-ID:',
      docRef.id
    );
    return docRef;
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
