import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreateNewPasswordComponent } from './create-new-password/create-new-password.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'create-account', component: CreateAccountComponent },
    { path: 'avatar', component: AvatarComponent },
    {path:'reset-password',component:ResetPasswordComponent},
    {path:'create-new-password',component:CreateNewPasswordComponent}
];
