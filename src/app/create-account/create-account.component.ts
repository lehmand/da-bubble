import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { addingUserService } from '../services/addingUser.service';
import { LoginComponent } from '../login/login.component';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    FormsModule,
    RouterModule,
    AvatarComponent,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent implements OnInit {
  userData = {
    name: '',
    email: '',
    password: '',
    privacyPolicy: false,
  };
  constructor(
    private addingUserService: addingUserService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  isDisabled: boolean = true;
  isHovered: boolean = false;
  isClicked: boolean = false;
  isChecked: boolean = false;

  async onSubmit(ngForm: NgForm) {
    debugger;
    if (ngForm.submitted && ngForm.form.valid) {
      console.log('contact was added');
      try {
        //const userCredential = await this.authService.registerUser(newUser);
        // await this.addingUserService.addUser(newUser);
      } catch (error) {
        console.error('Fehler beim Erstellen des Kontakts:', error);
      }
    }
  }

  toggleClicked() {
    this.isClicked = !this.isClicked;
  }

  toggleChecked() {
    this.isChecked = !this.isChecked;
  }

  toggleHover() {
    this.isHovered = !this.isHovered;
  }
}
