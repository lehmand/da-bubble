import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async createContact(contactData: { name: string; email: string; phone: string }) {
    const user = await this.authService.getCurrentUser(); // Warte auf das Ergebnis

    if (user) {
      const contactsRef = collection(this.firestore, 'contacts');
      const newContact = {
        ...contactData,
        userId: user.uid, // Verknüpfe den Kontakt mit der Benutzer-ID
        createdAt: new Date(),
      };

      // Neuen Kontakt in Firestore hinzufügen
      await addDoc(contactsRef, newContact);
      console.log('Kontakt erfolgreich erstellt:', newContact);
    } else {
      console.error('Benutzer ist nicht angemeldet.');
    }
  }
}