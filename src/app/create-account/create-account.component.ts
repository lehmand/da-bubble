import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { newUser } from '../interfaces/user.class';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { addingUserService } from '../services/addingUser.service';
import { LoginComponent } from '../login/login.component';
import { Subscriber, Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent implements OnInit {
  createUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private addingUserService: addingUserService,
    private authService: AuthService
  ) {
    this.createUserForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      userMail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      checkbox: [true, Validators.requiredTrue],
    });
  }

  ngOnInit() {}

  get f() {
    return this.createUserForm.controls;
  }

  isDisabled: boolean = true;
  isHovered: boolean = false;
  isClicked: boolean = false;
  isChecked: boolean = false;

  async onSubmit() {
    if (this.createUserForm.invalid) {
      return;
    }
    const newUser: newUser = {
      displayName: this.createUserForm.value.fullName,
      userMail: this.createUserForm.value.userMail,
      password: this.createUserForm.value.password,
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

  toggleClicked() {
    this.isClicked = !this.isClicked;
  }

  toggleChecked() {
    this.isChecked = !this.isChecked;
    this.proofIfChecked();
  }

  proofIfChecked() {
   
    if (this.isChecked) {
      this.createUserForm.get('checkbox')?.setValue(this.isChecked);
    } else {
      console.log('is not checked');
    }
  }

  toggleHover() {
    this.isHovered = !this.isHovered;
  }
}
