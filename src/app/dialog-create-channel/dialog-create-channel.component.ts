import { Component, inject, OnInit } from '@angular/core';
import { Channel } from '../models/channel.class';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore"; 
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-create-channel',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule],
  templateUrl: './dialog-create-channel.component.html',
  styleUrl: './dialog-create-channel.component.scss'
})
export class DialogCreateChannelComponent implements OnInit {
  constructor(
    private db: Firestore
  ){

  }
  isHovered: boolean = false;
  channel: Channel = new Channel();
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    
  }

  onSubmit(form: any){
    if(form.valid){
      this.addChannel()
    }
    setTimeout(() => {
      this.closeDialog()
    }, 1000);
  }

  closeDialog(){
    const dialogRef = this.dialog.closeAll()
  }

  async addChannel(){
    const channelsRef = collection(this.db, 'channels');
    const docRef = await addDoc(channelsRef, this.channel.toJSON());
    this.channel.channelId = docRef.id;
    await updateDoc(doc(channelsRef, docRef.id), {
      channelId: docRef.id
    })

  }

  toggleHover() {
    this.isHovered = !this.isHovered;
  }
}
