import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { newUser } from '../interfaces/user.class';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { addingUserService } from '../services/addingUser.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
   userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private addingUserService: addingUserService, 

  ) {
    this.userForm = this.formBuilder.group({
      fullName: [''], //für Validation//
      userMail: [''],
      password: [''],
    });
  } 

  isDefault: boolean = true;
  isHovered: boolean = false;
  isClicked: boolean = false;
  isChecked: boolean = false;

   async onSubmit() {
    const newUser: newUser = {
      displayName: this.userForm.value.fullName || '',
      userMail: this.userForm.value.userMail,
      password: this.userForm.value.password,
    };

    console.log('Neuer Benutzer:', newUser);
    try {
    //  const userCredential = await this.authService.registerUser(newUser);
      await this.addingUserService.addUser(newUser);

      // this.router.navigate(['/avatar-page']); // Route zum Avatar
    } catch (error) {
      console.error('Fehler beim Erstellen des Kontakts:', error);
    }
  }  

  toggleClicked() {
    this.isClicked = !this.isClicked;
  }

  toggleChecked() {
    this.isChecked = !this.isChecked;
    console.log(this.isChecked);
  }

  toggleHover() {
    this.isHovered = !this.isHovered;
  }
}
