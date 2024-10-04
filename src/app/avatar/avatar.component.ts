import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  doc,
  updateDoc,
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
  allUsers: User[] = [];
  unsub?: () => void;

  ngOnInit() {
    this.snapShotId();
  }

  async snapShotId() {
    const newUsersRef = collection(this.firestore, 'users');
    this.unsub = onSnapshot(
      newUsersRef,
      async (snapshot: QuerySnapshot<DocumentData>) => {
        const updatedUsers: User[] = [];
        for (const docSnapshot of snapshot.docs) {
          const userData = docSnapshot.data();
          const id = docSnapshot.id;
          const docRef = doc(this.firestore, 'users', id);
          await updateDoc(docRef, { id: id });
          const newUser = new User(userData, id);
          updatedUsers.push(newUser);
        }
        this.allUsers = updatedUsers;
        this.user = this.userService.getCurrentUser();
      }
    );
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
    console.log(this.user);
  }
}
