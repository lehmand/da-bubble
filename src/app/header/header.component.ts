import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  auth = inject(AuthService);
  firestore = inject(Firestore);


  logOut(){
    this.auth.logOut();
  }
}
