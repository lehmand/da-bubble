import { Component, Input, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GlobalVariableService } from '../services/global-variable.service';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, onSnapshot, doc, getDoc, query, where, setDoc,} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';

interface SendMessageInfo {
  text: string,
  senderId: string,
  senderName: string,
  senderPicture?: string,
  recipientId: string;
  recipientname: string;
  timestamp: Date;
}


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})


export class StartScreenComponent implements OnInit, OnChanges {
  constructor(public global: GlobalVariableService) { }
  chatMessage: string = '';
  firestore = inject(Firestore);
  messageInfos: any = [];
  userId: any | null = null;
  route = inject(ActivatedRoute);
  @Input() selectedUser: any;
  isMessagesended: boolean = false;
  dayInfo: boolean = false;
  messagesData: any = [];
  userservice =inject(UserService)
  user: User = new User();
  unsub?: () => void;


  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getcurrentUserById(this.userId);
   // this.userservice.observingUserChanges(this.userId, (updatedUser: User) => {
      //this.user = updatedUser;  
      if (this.global.statusCheck) {
        console.log(this.userId);
      }
    //}); 
    this.watchConversationStatus();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser'] && this.selectedUser?.id) {
      this.getMessages();
    }
    this.watchConversationStatus() 
  }

  async getcurrentUserById(userId: string) {
    const userRef = doc(this.firestore, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      this.global.currentUserData = {
        id: userSnapshot.id,
        ...userSnapshot.data()
      };
    }
  }

  messageData(): SendMessageInfo {
    let recipientId = this.selectedUser.id;
    let recipientName = this.selectedUser.name;
    if (this.global.statusCheck) {
      recipientId = this.global.currentUserData.id;
      recipientName = this.global.currentUserData.name;
    }
    return {
      text: this.chatMessage,
      senderId: this.global.currentUserData.id,
      senderName: this.global.currentUserData.name,
      senderPicture: this.global.currentUserData.picture || '',
      recipientId: this.selectedUser.id,
      recipientname: this.selectedUser.name,
      timestamp: new Date()
    };
  }

  async sendMessage() {
    if (this.chatMessage.trim() === '') {
      return;
    }
    const messagesRef = collection(this.firestore, 'messages');
    await addDoc(messagesRef, this.messageData()).then(() => {
      this.chatMessage = '';
      const conversationRef = doc(this.firestore, 'conversations', this.getConversationId());
       setDoc(conversationRef, { 
        senderId: this.global.currentUserData.id,
        recipientId: this.selectedUser.id,
        isMessagesended: true
      }, { merge: true });     
    })
  }
    

  getConversationId(): string {
    const ids = [this.global.currentUserData?.id, this.selectedUser?.id];
    ids.sort();
    return ids.join('_'); 
  }
 
  async watchConversationStatus() {
    const conversationId = this.getConversationId();
    const conversationRef = doc(this.firestore, 'conversations', conversationId);
    onSnapshot(conversationRef, (conversationSnapshot) => {
      if (conversationSnapshot.exists()) {
        const data = conversationSnapshot.data();
        if (data['isMessagesended'] !== undefined) {
          this.isMessagesended = data['isMessagesended'];
        }
      } else {
        this.isMessagesended = false;
      }
    });
  } 

  async getMessages() {
    const docRef = collection(this.firestore, 'messages');
    const q = query(
      docRef,
      where('recipientId', 'in', [this.selectedUser.id, this.global.currentUserData.id]),
      where('senderId', 'in', [this.selectedUser.id, this.global.currentUserData.id])
    );
    onSnapshot(q, (querySnapshot) => {
      this.messagesData = [];
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        if (messageData['timestamp'] && messageData['timestamp'].toDate) {
          messageData['timestamp'] = messageData['timestamp'].toDate();
        }
        if (
          (messageData['senderId'] === this.global.currentUserData.id && messageData['recipientId'] === this.selectedUser.id) ||
          (messageData['senderId'] === this.selectedUser.id && messageData['recipientId'] === this.global.currentUserData.id) ||
          (this.global.statusCheck && messageData['senderId'] === this.global.currentUserData.id && messageData['recipientId'] === this.global.currentUserData.id)
        ) {
          this.messagesData.push({ id: doc.id, ...messageData });
        }
      });
      this.messagesData.sort((a: any, b: any) => a.timestamp - b.timestamp);
    });
  }
}