import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreateNewPasswordComponent } from './create-new-password/create-new-password.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'create-account', component: CreateAccountComponent },
    { path: 'avatar/:id', component: AvatarComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'create-new-password', component: CreateNewPasswordComponent },
    { path: 'impressum', component: ImpressumComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
<<<<<<< HEAD
    { path: 'welcome', component: StartScreenComponent },
=======
    { path: 'welcome/:id', component: StartScreenComponent },
>>>>>>> 23ac6bddbe92c8f0d58f6773b939384bff5cddff
];
