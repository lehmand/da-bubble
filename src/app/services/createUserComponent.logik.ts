import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { addingUserService } from './addingUser.service'; // Importiere den ContactService//
import { newUser } from '../interfaces/user.class';
import { AuthService } from './auth.service';

/*@Component({
  selector: 'app-create-contact',
  templateUrl: './login.component.html',
})*/
export class createUserComponent {
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private addingUserService: addingUserService,
    private authService: AuthService
  ) {
    this.userForm = this.formBuilder.group({
      fullName: [''], //für Validation//
      userMail: [''],
      password: [''],
    });
  }

  async onSubmit() {
    const newUser: newUser = {
      displayName: this.userForm.value.fullName || '',
      userMail: this.userForm.value.userMail,
      password: this.userForm.value.password,
    };

    console.log('Neuer Benutzer:', newUser);
    try {
      const userCredential = await this.authService.registerUser(newUser);
      await this.addingUserService.addUser(newUser);

      // this.router.navigate(['/avatar-page']); // Route zum Avatar
    } catch (error) {
      console.error('Fehler beim Erstellen des Kontakts:', error);
    }
  } 
}
