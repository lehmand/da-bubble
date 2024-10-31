import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  inject,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GlobalVariableService } from '../services/global-variable.service';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  addDoc,
  collection,
  onSnapshot,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';
import { DialogHeaderProfilCardComponent } from '../dialog-header-profil-card/dialog-header-profil-card.component';
import { OverlayStatusService } from '../services/overlay-status.service';
import { DialogEditChannelComponent } from '../dialog-edit-channel/dialog-edit-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogChannelUserComponent } from '../dialog-channel-user/dialog-channel-user.component';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';

interface SendMessageInfo {
  text: string;
  senderId: string;
  senderName: string;
  senderPicture?: string;
  recipientId: string;
  recipientName: string;
  timestamp: Date;
  senderSticker?: string;
  senderStickerCount?: number;
  recipientSticker?: string;
  recipientStickerCount?: number;
  senderchoosedStickereBackColor?: string | null;
  recipientChoosedStickerBackColor?: string | null;
  stickerBoxCurrentStyle?: any;
  stickerBoxOpacity?: any;
}

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    DialogHeaderProfilCardComponent,
    DialogEditChannelComponent,
    DialogAddMemberComponent
  ],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent implements OnInit, OnChanges {
  constructor(public global: GlobalVariableService) {}

  overlayStatusService = inject(OverlayStatusService);
  openMyProfile = false;
  chatMessage: string = '';
  firestore = inject(Firestore);
  messageInfos: any = [];
  userId: any | null = null;
  route = inject(ActivatedRoute);
  @Input() selectedUser: any;
  @Input() selectedChannel: any;
  isMessagesended: boolean = false;
  checkDayInfo: boolean = false;
  dayInfo: any;
  channelMembers: any[] = [];
  messagesData: any = [];
  commentImages: string[] = [
    '../../assets/img/comment/hand.png',
    '../../assets/img/comment/celebration.png',
  ];
  commentStricker: string[] = [
    '../../assets/img/comment/face.png',
    '../../assets/img/comment/rocket.png',
  ];

  concatStickerArray: string[] = [
    ...this.commentImages,
    ...this.commentStricker,
  ];
  isHovered: any = false;
  hoveredName: any;
  hoveredSenderName: any;
  hoveredCurrentUser: any;
  hoveredRecipienUser: any;
  @ViewChild('scrollContainer') private scrollContainer: any = ElementRef;
  editMessageStatus: boolean = false;
  messageIdHovered: any;
  userservice = inject(UserService);
  dialog = inject(MatDialog);

  openDialog(){
    this.dialog.open(DialogEditChannelComponent, {
      data: this.selectedChannel,
      panelClass: 'edit-dialog',
      maxWidth: '872px',
      maxHeight: '616px',
    })
  }

  openMemberDialog() {
    this.dialog.open(DialogChannelUserComponent, {
      data: this.selectedChannel.userIds,
      panelClass: 'member-dialog',
      maxWidth: '415px',
      maxHeight: '411px',
    })
  }

  openAddMemberDialog() {
    this.dialog.open(DialogAddMemberComponent, {
      data: this.selectedChannel,
      panelClass: 'add-member-dialog',
      maxWidth: '514px',
      maxHeight: '294px', 
    })
  }


  scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
  }

  scrollAutoDown(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getcurrentUserById(this.userId);
    if (this.global.statusCheck) {
      console.log(this.userId);
    }
    this.watchConversationStatus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser'] && this.selectedUser?.id) {
      this.getMessages();
      this.global.clearCurrentChannel();
    }
    if (changes['selectedChannel'] && this.selectedChannel) {
      this.fetchChannelMembers();
      this.global.setCurrentChannel(this.selectedChannel);
    }
    this.watchConversationStatus();
  }

  async fetchChannelMembers() {
    if (!this.selectedChannel?.userIds) {
      this.channelMembers = [];
      return;
    }

    try {
      const membersPromises = this.selectedChannel.userIds.map(async (userId: string) => {
        const userRef = doc(this.firestore, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          return {
            id: userSnap.id,
            ...userSnap.data(),
          };
        }
        return null;
      });

      const members = await Promise.all(membersPromises);
      this.channelMembers = members.filter(member => member !== null);
    } catch (error) {
      console.error('Error fetching channel members:', error);
    }
  }

  async getcurrentUserById(userId: string) {
    try {
      const userRef = doc(this.firestore, 'users', userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        this.global.currentUserData = {
          id: userSnapshot.id,
          ...userSnapshot.data(),
        };
        this.userservice.observingUserChanges(userId, (updatedUser: User) => {
          this.selectedUser = updatedUser;
        });
      }
    } catch (error) {
      console.error('Fehler beim Abruf s Benutzers:', error);
    }
  }

  messageData(
    senderStickerCount: number,
    recipientStickerCount: number
  ): SendMessageInfo {
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
      recipientName: this.selectedUser.name,
      timestamp: new Date(),
      senderSticker: '',
      senderStickerCount: senderStickerCount || 1,
      recipientSticker: '',
      recipientStickerCount: recipientStickerCount || 1,
      senderchoosedStickereBackColor: '',
      recipientChoosedStickerBackColor: '',
      stickerBoxCurrentStyle: null,
      stickerBoxOpacity: null,
    };
  }

  async sendMessage() {
    if (this.chatMessage.trim() === '') {
      return;
    }
    const messagesRef = collection(this.firestore, 'messages');
    const messageData = this.messageData(
      this.messagesData.senderStickerCount,
      this.messagesData.recipientStickerCount
    );
    await addDoc(messagesRef, messageData).then(() => {
      this.chatMessage = '';
      this.scrollToBottom();
    });
    const conversationRef = doc(
      this.firestore,
      'conversations',
      this.getConversationId()
    );
    const conversationSnapshot = await getDoc(conversationRef);
    let firstMessageDate;
    const today = new Date();
    if (
      !conversationSnapshot.exists() ||
      !this.isSameDay(
        conversationSnapshot.data()?.['firstMessageDate']?.toDate(),
        today
      )
    ) {
      firstMessageDate = today;
      await setDoc(
        conversationRef,
        {
          senderId: this.global.currentUserData.id,
          recipientId: this.selectedUser.id,
          isMessagesended: true,
          firstMessageDate: firstMessageDate,
          checkDayInfo: true,
        },
        { merge: true }
      );
    }
  }

  getConversationId(): string {
    const ids = [this.global.currentUserData?.id, this.selectedUser?.id];
    ids.sort();
    return ids.join('_');
  }

  async watchConversationStatus() {
    const conversationId = this.getConversationId();
    const conversationRef = doc(
      this.firestore,
      'conversations',
      conversationId
    );

    onSnapshot(conversationRef, (conversationSnapshot) => {
      if (conversationSnapshot.exists()) {
        const data = conversationSnapshot.data();
        const firstMessageDate = data['firstMessageDate']?.toDate();
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (this.isSameDay(firstMessageDate, today)) {
          this.dayInfo = 'Heute';
        } else if (this.isSameDay(firstMessageDate, yesterday)) {
          this.dayInfo = 'Gestern';
        } else {
          this.dayInfo = this.formatDate(firstMessageDate);
        }
        this.isMessagesended = data['isMessagesended'];
        this.checkDayInfo = data['checkDayInfo'];
      } else {
        this.isMessagesended = false;
        this.checkDayInfo = false;
      }
    });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  async getMessages() {
    const docRef = collection(this.firestore, 'messages');
    const q = query(
      docRef,
      where('recipientId', 'in', [
        this.selectedUser.id,
        this.global.currentUserData.id,
      ]),
      where('senderId', 'in', [
        this.selectedUser.id,
        this.global.currentUserData.id,
      ])
    );
    onSnapshot(q, (querySnapshot) => {
      this.messagesData = [];
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        if (messageData['timestamp'] && messageData['timestamp'].toDate) {
          messageData['timestamp'] = messageData['timestamp'].toDate();
        }
        if (
          (messageData['senderId'] === this.global.currentUserData.id &&
            messageData['recipientId'] === this.selectedUser.id) ||
          (messageData['senderId'] === this.selectedUser.id &&
            messageData['recipientId'] === this.global.currentUserData.id) ||
          (this.global.statusCheck &&
            messageData['senderId'] === this.global.currentUserData.id &&
            messageData['recipientId'] === this.global.currentUserData.id)
        ) {
          this.messagesData.push({ id: doc.id, ...messageData });
        }
      });
      this.messagesData.sort((a: any, b: any) => a.timestamp - b.timestamp);
    });
  }

  editMessageId: string | null = null;
  editableMessageText: string = '';

  editMessages(message: any) {
    this.editMessageId = message.id;
    this.editableMessageText = message.text;
  }

  saveMessage(message: any) {
    const messageRef = doc(this.firestore, 'messages', message.id);
    const editMessage = { text: this.editableMessageText };
    updateDoc(messageRef, editMessage).then(() => {
      this.editMessageId = null;
    });
  }

  cancelEdit() {
    this.editMessageId = null;
    this.editableMessageText = '';
  }

  isiconShow: any;

  displayHiddenIcon(message: any) {
    this.isiconShow = message.id;
  }

  resetIcon(message: any) {
    this.isiconShow = null;
    const strickerRef = doc(this.firestore, 'messages', message.id);
    updateDoc(strickerRef, { stickerBoxCurrentStyle: null });
  }

  removeOpacity(message: any) {
    const opacityRef = doc(this.firestore, 'messages', message.id);
    updateDoc(opacityRef, { stickerBoxOpacity: null });
  }

  async chooseStricker(event: Event, message: any, selectedSticker: string) {
    if (this.global.currentUserData?.id === message.senderId) {
      message.senderchoosedStickereBackColor = selectedSticker;

      message.stickerBoxCurrentStyle = true;
      // message.stickerBoxOpacity=true;

      if (message.senderSticker === selectedSticker) {
        message.senderSticker = '';
        if (message.senderStickerCount === 2) {
          message.senderStickerCount = 1;
        }
      } else {
        message.senderSticker = selectedSticker;
        message.senderStickerCount = 1;
      }
      if (message.recipientSticker === selectedSticker) {
        message.recipientStickerCount =
          (message.recipientStickerCount || 1) + 1;
        message.senderSticker = '';

        if (message.recipientStickerCount === 2) {
          message.senderSticker = message.recipientSticker;
        }
        if (message.recipientStickerCount >= 3) {
          message.recipientStickerCount = 1;
        }
      }

      if (message.senderSticker !== message.recipientSticker) {
        message.recipientStickerCount = 1;
      }

      if (message.senderSticker === message.recipientSticker) {
        message.senderStickerCount = (message.senderStickerCount || 1) + 1;
      }
    } else if (this.global.currentUserData?.id !== message.senderId) {
      message.recipientChoosedStickerBackColor = selectedSticker;
      message.stickerBoxCurrentStyle = true;
      // message.stickerBoxOpacity=true

      if (message.recipientSticker === selectedSticker) {
        message.recipientSticker = '';
        if (message.recipientStickerCount === 2) {
          message.recipientStickerCount = 1;
        }
      } else {
        message.recipientSticker = selectedSticker;
        message.recipientStickerCount = 1;
      }
      if (message.senderSticker === selectedSticker) {
        message.senderStickerCount = (message.senderStickerCount || 1) + 1;
        if (message.senderStickerCount >= 3) {
          message.senderStickerCount = 1;
        }
      }

      if (message.recipientSticker !== '' && message.senderStickerCount === 2) {
        message.senderStickerCount = 1;
        message.recipientSticker = selectedSticker;
      }

      if (message.recipientSticker === message.senderSticker) {
        message.senderStickerCount = (message.senderStickerCount || 1) + 1;
      }
    }
    const messageData = this.messageData(
      message.senderStickerCount,
      message.recipientStickerCount
    );

    const strickerRef = doc(this.firestore, 'messages', message.id);
    const stikerObj = {
      senderSticker: message.senderSticker,
      senderStickerCount: message.senderStickerCount,
      recipientSticker: message.recipientSticker,
      recipientStickerCount: message.recipientStickerCount,
      senderchoosedStickereBackColor: message.senderchoosedStickereBackColor,
      recipientChoosedStickerBackColor:
        message.recipientChoosedStickerBackColor,
      stickerBoxCurrentStyle: message.stickerBoxCurrentStyle,
      stickerBoxOpacity: message.stickerBoxOpacity,
    };
    await updateDoc(strickerRef, stikerObj);
  }

  showMyUserProfile() {
    this.openMyProfile = true;
    this.overlayStatusService.setOverlayStatus(this.openMyProfile);
  }
}
