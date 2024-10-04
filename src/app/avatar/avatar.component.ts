import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  doc,
} from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { User } from '../models/user.class';
import { UserService } from '../services/user.service';

interface Picture {
  image: string | any;
}

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent implements OnInit {
  firestore = inject(Firestore);
  private userService = inject(UserService);
  user: User | null = null;

  userPicture: Picture = { image: '' };
  choosePicture: boolean | any = false;

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    console.log(this.user);
  }

  avatarBox: string[] = [
    '../../assets/img/avatar/avatar1.png',
    '../../assets/img/avatar/avatar2.png',
    '../../assets/img/avatar/avatar3.png',
    '../../assets/img/avatar/avatar4.png',
    '../../assets/img/avatar/avatar5.png',
    '../../assets/img/avatar/avatar6.png',
  ];

  chossePicture(avatar: string) {
    this.choosePicture = avatar;
    this.userPicture.image = this.choosePicture;
    //this.userPicture.image = this.choosePicture;
    //   const addingUser = collection(this.firestore, 'picture');
    //   await addDoc(addingUser, this.userPicture);
    //   console.log('Document written with ID: ', addingUser.id);
  }

  async saveAvatar() {
    if (this.user) {
      const userRef = doc(this.firestore, 'users', this.user.email); // Erstelle eine Referenz zum Firestore-Dokument

      try {
        await updateDoc(userRef, {
          picture: this.userPicture.image,
        });
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Benutzerdaten:');
      }
    }
  }
}
