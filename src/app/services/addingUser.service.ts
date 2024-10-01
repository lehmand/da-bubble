import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { newUser } from '../interfaces/user.class';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root' 
})
export class addingUserService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addUser(userData: newUser) {
    const currentUser = await this.authService.getCurrentUser(); 

    if (currentUser) {
      const contactsRef = collection(this.firestore, 'users');
      const userToAdd = {
        ...userData, // Kopiert alle Felder von contactData (name, userMail, password)
        userId: currentUser.uid, // Verknüpft den Kontakt mit der Benutzer-ID
      };

      // neuen Kontakt in Firestore 
      await addDoc(contactsRef, userToAdd);
      console.log('Kontakt erfolgreich erstellt:', userToAdd);
    } else {
      console.error('Benutzer ist nicht angemeldet.');
    }
  } 
}
