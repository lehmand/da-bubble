import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginFailed = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Controls
  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;

    try {
      const user = await this.authService.login(email, password);
      console.log('Login erfolgreich!', user);

      // Weiterleitung auf Dashboard oder andere Seite
    } catch (error: any) {
      console.error('Login fehlgeschlagen:', error);
      this.loginFailed = true;

      // Fehler basierend auf dem Typ setzen
      if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Das Passwort ist falsch.';
      } else if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'Es gibt keinen Benutzer mit dieser E-Mail.';
      } else {
        this.errorMessage =
          'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.';
      }
    }
  }
}
