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
    const fullName = this.userForm.value.fullName;
    const [first, last] = fullName.split(' ');

    const newUser: newUser = {
      name: {
        firstName: first || '', // Fallback
        lastName: last || '', // Fallback
      },
      userMail: this.userForm.value.userMail,
      password: this.userForm.value.password,
    };

    console.log('Neuer Benutzer:', newUser);
    try {
      const userCredential = await this.authService.registerUser(newUser);

     // this.router.navigate(['/avatar-page']); // Route zum Avatar
    } catch (error) {
      console.error('Fehler beim Erstellen des Kontakts:', error);
    }
  }
}
