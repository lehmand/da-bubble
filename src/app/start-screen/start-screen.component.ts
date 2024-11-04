import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  inject,
  ElementRef,
  ViewChild,
  HostListener
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
  deleteDoc
} from '@angular/fire/firestore';

import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';
import { PeopleMentionComponent } from "../people-mention/people-mention.component";
import { DialogHeaderProfilCardComponent } from '../dialog-header-profil-card/dialog-header-profil-card.component';
import { OverlayStatusService } from '../services/overlay-status.service';
import { DialogEditChannelComponent } from '../dialog-edit-channel/dialog-edit-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogChannelUserComponent } from '../dialog-channel-user/dialog-channel-user.component';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { ProfileContactCardComponent } from '../profile-contact-card/profile-contact-card.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

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
  selectedFiles?:any [] 
}

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    FormsModule, PeopleMentionComponent,
    DialogHeaderProfilCardComponent,
    DialogEditChannelComponent,
    DialogAddMemberComponent,
    ProfileContactCardComponent,
    PickerComponent,
  ],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent implements OnInit, OnChanges {
  constructor(public global: GlobalVariableService, private elementRef: ElementRef ) {}

  isEmojiPickerVisible: boolean = false;
  currentUserwasSelected = false;
  contactWasSelected = false;
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

   

  concatStickerArray: string[] = [...this.commentImages, ...this.commentStricker];
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
  showStickerDiv: any
  checkUpdateBackcolor: any
  editMessageId: string | null = null;
  editableMessageText: string = '';
  isiconShow: any;
  @Input() mentionUser: string = '';
  selectFiles: any[] = [];

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
      data: {
        members: this.selectedChannel.userIds,
        channel: this.selectedChannel
      },
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
      maxHeight: '320px', 
    })
  }

 
  

  scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
  }

  //function to close emoji picker by clicking outside//
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
      const targetElement = this.elementRef.nativeElement;
      const emojiButton = targetElement.querySelector('.emoji-picker-container div'); 
      const emojiPicker = targetElement.querySelector('.emoji-picker-container .emoji-picker'); 

      const isEmojiButtonClicked = emojiButton && emojiButton.contains(event.target);
      const isPickerClicked = emojiPicker && emojiPicker.contains(event.target);

      if (!isEmojiButtonClicked && !isPickerClicked) {
          this.isEmojiPickerVisible = false; 
      }
  }
  //____________________//

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
      this.checkProfileType();
      this.getMessages();
      this.chatMessage = '';
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
      selectedFiles:this.selectFiles
    };
  }

  async sendMessage() {
    if (this.chatMessage.trim() === '') {
      return;
    }

    const messagesRef = collection(this.firestore, 'messages');
    const messageData = this.messageData(this.messagesData.senderStickerCount, this.messagesData.recipientStickerCount);
      await addDoc(messagesRef, messageData).then(() => {
      this.chatMessage = '';
      this.selectFiles=[];
      this.scrollToBottom();
    });
    

    const conversationRef = doc(this.firestore, 'conversations', this.getConversationId());
    const conversationSnapshot = await getDoc(conversationRef);
    const today = new Date();
    if (conversationSnapshot.exists()) {
      const conversationData = conversationSnapshot.data();
      const dailyMessageDates = conversationData['dailyMessageDates'] || [];
      const lastDate = dailyMessageDates[dailyMessageDates.length - 1]?.toDate();
      if (!lastDate || !this.isSameDay(lastDate, today)) {
        dailyMessageDates.push(today);
        await setDoc(conversationRef, { dailyMessageDates }, { merge: true });
      }
    } else {
      await setDoc(conversationRef, {
        senderId: this.global.currentUserData.id,
        recipientId: this.selectedUser.id,
        isMessagesended: true,
        dailyMessageDates: [today],
        checkDayInfo: true
      }, { merge: true });
    }
    this.scrollToBottom();
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
        const dailyMessageDates = data['dailyMessageDates'] || [];
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const lastDate = dailyMessageDates[dailyMessageDates.length - 1]?.toDate();
        if (lastDate && this.isSameDay(lastDate, today)) {
          this.dayInfo = 'Heute';
        } else if (lastDate && this.isSameDay(lastDate, yesterday)) {
          this.dayInfo = 'Gestern';
        } else {
          this.dayInfo = this.formatDate(lastDate || today);
        }
        this.isMessagesended = data['isMessagesended'];
        this.checkDayInfo = data['checkDayInfo'];
      } else {
        this.isMessagesended = false;
        this.checkDayInfo = false;
      }
    });
  }


  getDayInfoForMessage(index: number): string {
    const messageDate = new Date(this.messagesData[index].timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (this.isSameDay(messageDate, today)) {
      return 'Heute';
    } else if (this.isSameDay(messageDate, yesterday)) {
      return 'Gestern';
    } else {
      return this.formatDate(messageDate);
    }
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


  displayDayInfo(index: number): boolean {
    if (index === 0) return true;
    const currentMessage = this.messagesData[index];
    const previousMessage = this.messagesData[index - 1];
    return !this.isSameDay(new Date(currentMessage.timestamp), new Date(previousMessage.timestamp));
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





  editMessages(message: any) {
    this.editMessageId = message.id;
    this.editableMessageText = message.text;
  }

  saveOrDeleteMessage(message: any) {
    const messageRef = doc(this.firestore, 'messages', message.id);
    if (this.editableMessageText.trim() === '') {
      deleteDoc(messageRef).then(() => {
        this.editMessageId = null;
      });
    } else {
      const editMessage = { text: this.editableMessageText };
      updateDoc(messageRef, editMessage).then(() => {
        this.editMessageId = null;
      });
    }
  }

  cancelEdit() {
    this.editMessageId = null;
    this.editableMessageText = '';
  }

  displayHiddenIcon(message: any) {
    this.isiconShow = message.id;
  }

  resetIcon(message: any) {
    this.isiconShow = null;
    const strickerRef = doc(this.firestore, 'messages', message.id);
    updateDoc(strickerRef, { stickerBoxCurrentStyle: null });
  }

  removeOpacity(message: any) {
    this.checkUpdateBackcolor = null
    const opacityRef = doc(this.firestore, 'messages', message.id)
    updateDoc(opacityRef, { stickerBoxOpacity: null, stickerBoxCurrentStyle: true })
  }

  displayOpacity(message: any) {
    this.checkUpdateBackcolor = message.id
    const opacityRef = doc(this.firestore, 'messages', message.id)
    updateDoc(opacityRef, { stickerBoxOpacity: true, stickerBoxCurrentStyle: true })
  }

  showStickerCard(message: any) {
    this.showStickerDiv = message.id
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
      stickerBoxOpacity: message.stickerBoxOpacity
    }
    await updateDoc(strickerRef, stikerObj);
  }

  resetProfileSelection() {
    this.currentUserwasSelected = false;
    this.contactWasSelected = false;
  }

  showMyUserProfile() {
    this.resetProfileSelection();
    this.checkProfileType();
    this.openMyProfile = true;
    this.overlayStatusService.setOverlayStatus(this.openMyProfile);
  }

  checkProfileType() {
    if (this.selectedUser.uid === this.userId) {
      this.currentUserwasSelected = true;
    } else {
      this.contactWasSelected = true;
    }
  }

  closeMyUserProfile() {
    this.openMyProfile = false;
    this.overlayStatusService.setOverlayStatus(false);
  }


  //open - close emoji-picker//
  toggleEmojiPicker() {
    console.log('ok')
    debugger;
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
    if (this.isEmojiPickerVisible) {
      setTimeout(() => {
        this.isEmojiPickerVisible = true;
      }, 0);
    }
  }  


// choose emoji and close menu//
  addEmoji(event: any) {
    console.log('ok')
    const emoji = event.emoji.native; 
    this.chatMessage += emoji; 
    this.isEmojiPickerVisible = false;
     console.log(this.isEmojiPickerVisible, 'visible?');
  }



  openMentionPeople() {
    this.global.openMentionPeopleCard = !this.global.openMentionPeopleCard
  }


  handleMentionUser(mention: string) {
    this.mentionUser = mention;
    console.log(this.mentionUser)
    this.chatMessage += this.mentionUser;
  }





  onFileSelected(event:Event,) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                this.selectFiles.push({ 
                    type: file.type, 
                    data: reader.result as string
                });
                console.log(this.selectFiles);
            };
            reader.readAsDataURL(file); 
        });
        input.value = ''; 
    }
  }




}


