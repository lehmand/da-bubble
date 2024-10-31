import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { User } from '../models/user.class';
import { doc, Firestore } from '@angular/fire/firestore';
import { getDoc } from '@firebase/firestore';

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
  db = inject(Firestore)
  dialog = inject(MatDialog)
  user: User = new User();
  allMembers: any[] = [];
  detailedMember: any;
  showDetails: boolean = false;

  ngOnInit(): void {
    this.getUserData()
  }

  getUserData() {
    this.members.forEach(async (memberId: string) => {
      const docRef = doc(this.db, 'users', memberId);
      const userDoc = await getDoc(docRef);
      if(userDoc.data()){
        this.allMembers.push(userDoc.data());
      }
    })
  }
}
