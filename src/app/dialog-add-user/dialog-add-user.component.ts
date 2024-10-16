import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { collection, doc, Firestore, getDoc, onSnapshot } from '@angular/fire/firestore';
import { User } from '../models/user.class';

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
    private db: Firestore,
    private dialogRef: MatDialogRef<DialogAddUserComponent>
  ){
  }
  readonly dialog = inject(MatDialog);
  isHovered: boolean = false;
  channel: any = {};
  searchInput: string = '';
  addAllUsers: boolean = false;
  selectUsers: boolean = false;
  

  allUsers: string [] = [];
  filteredUsers: string [] = [];



  ngOnInit(): void {
    this.getCreatedChannel(this.channelId);
    this.getAllUsers()
  }

  onSubmit(form: any){

  }

  closeDialog(){
    this.dialog.closeAll()
  }

  getAllUsers(){
    const colRef = collection(this.db, 'users');
    const docRef = onSnapshot(colRef, (user) => {
      user.forEach((data) => {
        this.allUsers.push(data.id)
      })
    })
  }

  async getCreatedChannel(channelId: string){
    const docRef = doc(this.db, 'channels', channelId);
    const docSnap = await getDoc(docRef);
    this.channel = docSnap.data()
  }

  toggleHover(){
    this.isHovered = !this.isHovered;
  }

  toggleAllUsers(){
    this.addAllUsers = true;
    this.selectUsers = false;
    this.updateDialogHeight();
  }

  toggleSelectUsers(){
    this.addAllUsers = false;
    this.selectUsers = true;
    this.updateDialogHeight();
  }

  updateDialogHeight() {
    if (this.selectUsers) {
      this.dialogRef.updateSize('710px', '354px'); // Set height to 500px when selectUsers is true
    } else {
      this.dialogRef.updateSize('710px', '310px'); // Set height to 300px when selectUsers is false
    }
  }
}
