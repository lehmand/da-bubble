import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

interface Picture {
  image: string | any;
}


@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {



  userPicture: Picture = {
    image: ''
  }

  choosePicture: boolean | any = false;
  firestore = inject(Firestore)




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
  //   this.userPicture.image = this.choosePicture;
  //   const addingUser = collection(this.firestore, 'picture');
  //   await addDoc(addingUser, this.userPicture);
  //   console.log('Document written with ID: ', addingUser.id);
  }
}








