import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../models/user.class';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {
  user: User = new User();
  editModusOpen = true;

  closeEditModus(){
    this.editModusOpen = false;
  }


}
