<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  Unsubscribe,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from '@angular/fire/firestore';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from '../dialog-create-channel/dialog-create-channel.component';
=======
import { CommonModule, } from '@angular/common';
import { Component, OnInit, inject, Output, EventEmitter,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { GlobalVariableService } from '../services/global-variable.service';
>>>>>>> e8f8a4c31c815c2cdee6952216598dad1fbc6732

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, MatDialogModule, DialogCreateChannelComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
<<<<<<< HEAD
=======


>>>>>>> e8f8a4c31c815c2cdee6952216598dad1fbc6732
export class WorkspaceComponent implements OnInit {
  userId: any | null = null;
  route = inject(ActivatedRoute);
  firestore = inject(Firestore);
<<<<<<< HEAD
  userData: any = {};
  allUsers: any = [];
  allChannels: any = [];
  checkUsersExsists: boolean = false;
  @Output() userSelected = new EventEmitter<any>();
  readonly dialog = inject(MatDialog);
  private channelsUnsubscribe: Unsubscribe | undefined;

  openDialog() {
    const dialogRef = this.dialog.open(DialogCreateChannelComponent, {
      data: {
        userId: this.userId
      },
      height: '539px',
      width: '872px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllChannels();
    });
  }

  selectUser(user: any) {
    this.userSelected.emit(user);
=======

  allUsers: any = [];
  checkUsersExsists: boolean = false;
  @Output() userSelected = new EventEmitter<any>();
  @Output() userCurrentSelected = new EventEmitter<any>();
   

  constructor(public global:GlobalVariableService ){}

  selectUser(user: any) {
    this.userSelected.emit(user);
    this.global.statusCheck=false;
  }

  selectCurrentUser() { 
    this.global.statusCheck=true;
    this.userSelected.emit(this.global.currentUserData);   
>>>>>>> e8f8a4c31c815c2cdee6952216598dad1fbc6732
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getUserById(this.userId);
    }
    console.log('workspace', this.userId)
    this.getAllChannels();
  }

  ngOnDestroy(): void {
    if (this.channelsUnsubscribe) {
      this.channelsUnsubscribe();
    }
  }

  async getAllChannels(){
    const colRef = collection(this.firestore, 'channels');
    this.channelsUnsubscribe = onSnapshot(colRef, (snapshot) => {
      this.allChannels = snapshot.docs.map(doc => doc.data());
    });
  }

  async getUserById(userId: string) {
    const userDocref = doc(this.firestore, 'users', userId);
    const userDoc = await getDoc(userDocref);
<<<<<<< HEAD
=======
  
>>>>>>> e8f8a4c31c815c2cdee6952216598dad1fbc6732
    if (userDoc.exists()) {
      this.global.currentUserData = {
        id: userDoc.id,
        ...userDoc.data() 
      };

    }
  }

  async getAllUsers() {
    const usersCollection = collection(this.firestore, 'users');
    onSnapshot(usersCollection, (snapshot) => {
      this.allUsers = [];
      snapshot.forEach((doc) => {
        this.checkUsersExsists = true;
        if (doc.id !== this.userId) {
<<<<<<< HEAD
          this.allUsers.push({ id: doc.id, ...doc.data() });
=======
          this.allUsers.push({ id: doc.id, ...doc.data()});
>>>>>>> e8f8a4c31c815c2cdee6952216598dad1fbc6732
        }
      });
    });
  } 

<<<<<<< HEAD
=======
   


>>>>>>> e8f8a4c31c815c2cdee6952216598dad1fbc6732
  channelDrawerOpen: boolean = true;
  messageDrawerOpen: boolean = true;

  toggleChannelDrawer() {
    this.channelDrawerOpen = !this.channelDrawerOpen;
    console.log(this.channelDrawerOpen);
  }
  toggleMessageDrawer() {
    this.messageDrawerOpen = !this.messageDrawerOpen;
<<<<<<< HEAD
    console.log(this.messageDrawerOpen);
  }
=======
    console.log(this.messageDrawerOpen)
  } 
>>>>>>> e8f8a4c31c815c2cdee6952216598dad1fbc6732
}
