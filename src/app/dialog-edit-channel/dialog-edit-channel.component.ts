import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-edit-channel.component.html',
  styleUrl: './dialog-edit-channel.component.scss',
})
export class DialogEditChannelComponent implements OnInit {
  db: Firestore = inject(Firestore);
  channel = inject(MAT_DIALOG_DATA);
  createdBy: string = '';
  isEditingName: boolean = false;
  isEditingDescription: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log(this.channel);
    this.getCreaterData();
  }

  async getCreaterData() {
    const docRef = doc(this.db, 'users', this.channel.createdBy);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const user = docSnap.data();
      this.createdBy = user['name'];
    }
  }

  editName() {
    this.isEditingName = true;
  }

  editDescription() {
    this.isEditingDescription = true;
  }

  saveName() {
    this.isEditingName = false;
  }

  saveDescription() {
    this.isEditingDescription = false;
  }
}
