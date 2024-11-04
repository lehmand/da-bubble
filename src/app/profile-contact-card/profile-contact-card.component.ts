import { CommonModule } from '@angular/common';
import { Component, inject, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { User } from '../models/user.class';
import { OverlayStatusService } from '../services/overlay-status.service';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile-contact-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-contact-card.component.html',
  styleUrl: './profile-contact-card.component.scss',
})
export class ProfileContactCardComponent implements OnInit {
  user: User = new User();
  contactCardopen = false;
  overlayStatusService = inject(OverlayStatusService);
  firestore = inject(Firestore);
  userservice = inject(UserService);
  userID: any;
  @Output() closeProfile = new EventEmitter<void>();
  @Input() selectedContact?: User; 

  constructor() {}

  ngOnInit(): void {
    if (this.selectedContact) {
      this.user = this.selectedContact;
    }
  }

  
  closeProfileCard() {
    this.contactCardopen = false;
    this.overlayStatusService.setOverlayStatus(false);
    this.closeProfile.emit();
  }
}
