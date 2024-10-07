import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Firestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent implements OnInit {
  firestore = inject(Firestore);
  route = inject(ActivatedRoute);
  choosePicture: string = '';
  userId: string | null = null;
  chooseOwnPicture = false;
  storage: any; 

  avatarBox: string[] = [
    '../../assets/img/avatar/avatar1.png',
    '../../assets/img/avatar/avatar2.png',
    '../../assets/img/avatar/avatar3.png',
    '../../assets/img/avatar/avatar4.png',
    '../../assets/img/avatar/avatar5.png',
    '../../assets/img/avatar/avatar6.png',
  ];

  constructor() {
    this.storage = getStorage(); // Hier wird storage initialisiert
  }

  chossePicture(avatar: string) {
    this.choosePicture = avatar;
  }

  async getUserById(userId: string) {
    const userRef = doc(this.firestore, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      console.log('User data:', userSnapshot.data());
    } else {
      console.log('No such document!');
    }
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getUserById(this.userId);
    }
  }

  async saveAvatar() {
    if (this.userId && this.choosePicture) {
      const userRef = doc(this.firestore, 'users', this.userId);
      await updateDoc(userRef, {
        picture: this.choosePicture,
      });
      console.log('Avatar updated for user ID:', this.userId);
    } else {
      console.error('User ID or Avatar is missing.');
    }
  }


}