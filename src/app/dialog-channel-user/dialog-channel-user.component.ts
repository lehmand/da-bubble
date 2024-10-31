import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-channel-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-channel-user.component.html',
  styleUrl: './dialog-channel-user.component.scss'
})
export class DialogChannelUserComponent implements OnInit{
  constructor(){}
  
  members = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    console.log(this.members);
  }
}
