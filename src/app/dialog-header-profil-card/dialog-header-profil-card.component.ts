import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { User } from '../models/user.class';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { OverlayStatusService } from '../services/overlay-status.service';
import {  Firestore, where, query, updateDoc, collection, getDocs } from '@angular/fire/firestore';
@Component({
  selector: 'app-dialog-header-profil-card',
  standalone: true,
  imports: [CommonModule, DialogEditUserComponent],
  templateUrl: './dialog-header-profil-card.component.html',
  styleUrl: './dialog-header-profil-card.component.scss',
})
export class DialogHeaderProfilCardComponent implements OnInit {
  guestLogin = false;
  noGuestAccount = false;
  user: User = new User();
  userID: any;
  userservice = inject(UserService);
  isCurrentUser = false;
  openEdit = false;
  profileCardopen = true;
  overlayStatusService = inject(OverlayStatusService);
  firestore =inject(Firestore);
  clicked = true;
  @Output() closeProfile = new EventEmitter<void>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (paramMap) => {
      this.userID = paramMap.get('id');
      if (this.userID) {
        const userResult = await this.userservice.getUser(this.userID);
        if (userResult) {
          this.user = userResult;
          this.checkGuestUser(userResult);
        }
      }
    });

  }
  async checkGuestUser(userResult: User) {
    const guestEmail = 'guest@account.de';
    if (userResult.email === guestEmail) {
      this.guestLogin = true;
    } else {
      this.noGuestAccount = true;
    }
  }


  closeProfileCard() {
    this.profileCardopen = false;
    this.overlayStatusService.setOverlayStatus(false);
    this.closeProfile.emit();
  }

  editOwnProfileCard() {
    this.openEdit = true;
    this.profileCardopen = false;
  }
}
