import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Firestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { RouterModule,Router,ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})

export class AvatarComponent implements OnInit {
  constructor(private auth: AuthService){}
  firestore = inject(Firestore);
  route = inject(ActivatedRoute);
  choosePicture: string = '';
  userId: string | null = null;
  chooseOwnPicture: any;
  storage=inject(Storage);
  previewUrl: string | undefined;
  selectedFile: File | null = null;
  userObject: any = {};
  sendInfo:boolean=false;
  router=inject(Router)

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
    this.previewUrl = undefined;
    this.selectedFile = null;
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getUserById(this.userId);
    }
  }

  async getUserById(userId: string) {
    const userRef = doc(this.firestore, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      this.userObject = userSnapshot.data();
      this.auth.user = this.userObject;
      console.log('User data:', this.auth.user);
    } else {
      console.log('No such document!');
    }
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.choosePicture = '';
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
      input.value = '';
    }
  }
  
  async saveAvatar() {
    if (!this.userId) {
      return;
    }
    if (this.selectedFile) {
      try {
        const filePath = `avatars/${this.userId}/${this.selectedFile.name}`;
        const storageRef = ref(this.storage, filePath);
        await uploadBytes(storageRef, this.selectedFile);
        const downloadURL = await getDownloadURL(storageRef);
        await this.updateUserAvatar(downloadURL);
        this.sendInfo=true;
        this.checkSendIfo();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else if (this.choosePicture) {
      await this.updateUserAvatar(this.choosePicture);
    }
  }

  async updateUserAvatar(avatarUrl: string) {
    if (!this.userId) return;
    const userRef = doc(this.firestore, 'users', this.userId);
    await updateDoc(userRef, { picture: avatarUrl });
    this.sendInfo=true;
    this.checkSendIfo();
  } 


    checkSendIfo ():void{
        setTimeout(() => {
          this.sendInfo=false;
        }, 1000);
  }
}