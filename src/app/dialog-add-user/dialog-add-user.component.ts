import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [CommonModule ,MatDialogModule, FormsModule],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent implements OnInit{
  constructor(
    @Inject(MAT_DIALOG_DATA) public channelId: string,
    private db: Firestore
  ){
  }
  readonly dialog = inject(MatDialog);
  isHovered: boolean = false;
  addAllUsers: boolean = false;
  channel: any = {};

  ngOnInit(): void {
    this.getCreatedChannel(this.channelId);
  }

  onSubmit(form: any){

  }

  closeDialog(){
    this.dialog.closeAll()
  }

  async getCreatedChannel(channelId: string){
    const docRef = doc(this.db, 'channels', channelId);
    const docSnap = await getDoc(docRef);
    this.channel = docSnap.data()
    console.log(this.channel)
  }

  toggleHover(){
    this.isHovered = !this.isHovered;
  }
  toggleAllUsers(){
    this.addAllUsers = !this.addAllUsers
  }
}
