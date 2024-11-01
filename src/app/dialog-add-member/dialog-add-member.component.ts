import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-member',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dialog-add-member.component.html',
  styleUrl: './dialog-add-member.component.scss'
})
export class DialogAddMemberComponent {
  constructor(){}

  channel = inject(MAT_DIALOG_DATA);
  dialog = inject(MatDialog)
  memberToAdd: any;


  closeDialog() {
    this.dialog.closeAll()
  }
}
