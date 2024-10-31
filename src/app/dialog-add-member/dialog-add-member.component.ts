import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-add-member.component.html',
  styleUrl: './dialog-add-member.component.scss'
})
export class DialogAddMemberComponent {
  constructor(){}

  channel = inject(MAT_DIALOG_DATA);

}
