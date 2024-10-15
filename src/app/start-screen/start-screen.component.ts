import { Component, Input, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GlobalVariableService } from '../services/global-variable.service';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';


interface SendMessageInfo {
  text: string,
  senderId: string | any,
  senderName: string | any,
  senderPicture?: string,
  recipientId: string;
  timestamp: Date;
}



@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})


export class StartScreenComponent implements OnInit {

  constructor(public global: GlobalVariableService) {

  }

  chatMessage: string = '';
  @Input() selectedUser: any;
  @Input() userCurrentSelected: any;
  firestore = inject(Firestore);

  ngOnInit(): void {

  }



  sendMessage() {
    if (this.chatMessage.trim() === '') {
      return;
    }

    const message: SendMessageInfo = {
      text: this.chatMessage,
      senderId: this.userCurrentSelected.id,
      senderName: this.userCurrentSelected.name,
      senderPicture: this.userCurrentSelected.picture || '',
      recipientId: this.selectedUser.id,
      timestamp: new Date()
    };

    const messagesRef = collection(this.firestore, 'messages');
    addDoc(messagesRef, message).then(() => {
      this.chatMessage = '';
    }).catch(error => {
      console.error('Error sending message: ', error);
    });
  }
}

