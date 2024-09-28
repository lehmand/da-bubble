import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AvatarComponent } from './avatar/avatar.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path:'avatar',component:AvatarComponent}
];
