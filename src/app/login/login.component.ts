import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ResetPasswordComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: '',
  };
  loginFailed = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      console.log('loginData working');
    }
    try {
      //const user = await this.authService.login(email, password);
      // Weiterleitung auf Dashboard oder andere Seite
    } catch (error: any) {
      console.error('Login fehlgeschlagen:', error);
      this.loginFailed = true;
    }
  }
}
