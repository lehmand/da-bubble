import { Component, OnInit, inject } from '@angular/core';
import { User } from '../models/user.class';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { DialogEditUserComponent } from "../dialog-edit-user/dialog-edit-user.component";

@Component({
  selector: 'app-dialog-header-profil-card',
  standalone: true,
  imports: [CommonModule, DialogEditUserComponent],
  templateUrl: './dialog-header-profil-card.component.html',
  styleUrl: './dialog-header-profil-card.component.scss',
})
export class DialogHeaderProfilCardComponent implements OnInit {
  user: User = new User();
  userID: any;
  userservice = inject(UserService);
  isCurrentUser = false;
  openEdit = false;
  profileCardopen = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (paramMap) => {
      this.userID = paramMap.get('id');
      if (this.userID) {
        const userResult = await this.userservice.getUser(this.userID);
        if (userResult) {
          this.user = userResult;
          this.setAsCurrentUser();
        }
      }
    });
  }

  setAsCurrentUser() {
    this.isCurrentUser = true;
  }

  closeProfile() {
    this.profileCardopen = false;
  }


  editOwnProfileCard(){
    this.openEdit = true;
    this.profileCardopen = false;
  }
}
