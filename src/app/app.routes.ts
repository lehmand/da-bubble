import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path:'reset-password',component:ResetPasswordComponent}
];
