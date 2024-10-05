import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Firestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  choosePicture: string ='';
  userId: string | null = null;
  chooseOwnPicture: any 



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
    this.previewUrl = undefined;
    this.selectedFile = null;
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
     console.log( this.nameObject)
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getUserById(this.userId);
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
  
   nameObject:any=[]

  async getUsersName() {
    if (this.userId) {
      const docRef = doc(this.firestore, "users", this.userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.nameObject.push(docSnap.data()); 
        console.log(this.nameObject)
      this.nameObject=docSnap
      console.log(this.nameObject)
    }
  } 
}
  


  async saveAvatar() {
    if (!this.userId) {
      console.error('User ID is missing.');
      return;
    }
    if (this.selectedFile) {
      try {
        const filePath = `avatars/${this.userId}/${this.selectedFile.name}`;
        const storageRef = ref(this.storage, filePath);
        await uploadBytes(storageRef, this.selectedFile);
        const downloadURL = await getDownloadURL(storageRef);
        await this.updateUserAvatar(downloadURL);
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
    console.log('Avatar updated for user ID:', this.userId);
  }


  imageReady(imageURL: string){
    console.log('gavw ths URL', imageURL);
  }

/*   async uploadImage(event: any) {
    this.chooseOwnPicture = true; // Benutzer wählt ein eigenes Bild
    if (this.chooseOwnPicture) {
      const file = event.target.files[0];
      if (file) {
        console.log('Datei ausgewählt:', file.name);
        const path = `avatars/${file.name}`; // Pfad für das Bild
        const storageRef = ref(this.storage, path); // Verweis auf das Bild im Storage
  
        try {
          await uploadBytes(storageRef, file); // Bild hochladen
          const url = await getDownloadURL(storageRef); // URL des hochgeladenen Bildes abrufen
          console.log('Bild-URL:', url);
          this.imageReady(url); // Bild-URL an die Methode übergeben
        } catch (error) {
          console.error('Fehler beim Hochladen des Bildes:', error);
        }
      } else {
        console.error('Keine Datei ausgewählt.');
      }
    } else {
      console.error('Wählen Sie ein eigenes Bild aus.');
    }
  } */
}