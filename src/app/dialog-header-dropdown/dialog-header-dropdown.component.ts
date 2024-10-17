import { Component, inject, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { DialogHeaderProfilCardComponent } from '../dialog-header-profil-card/dialog-header-profil-card.component';

@Component({
  selector: 'app-dialog-header-dropdown',
  standalone: true,
  imports: [CommonModule, DialogHeaderProfilCardComponent],
  templateUrl: './dialog-header-dropdown.component.html',
  styleUrl: './dialog-header-dropdown.component.scss',
})
export class DialogHeaderDropdownComponent {
  authService = inject(AuthService);
  wasClicked = false;
  showDropDownOptions = true;

  openProfile() {
    this.wasClicked = true;
    this.showDropDownOptions = false;
  }


  logOut() {
    this.authService.logOut();
  }

}
