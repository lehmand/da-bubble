import { CommonModule, } from '@angular/common';
import { Component, OnInit, inject, Output, EventEmitter,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { GlobalVariableService } from '../services/global-variable.service';


@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})

export class WorkspaceComponent implements OnInit {
  userId: any | null = null;
  route = inject(ActivatedRoute);
  firestore = inject(Firestore);
  currentUserData: any = {};
  allUsers: any = [];
  checkUsersExsists: boolean = false;
  @Output() userSelected = new EventEmitter<any>();
  @Output() userCurrentSelected = new EventEmitter<any>();
   

  constructor( private global:GlobalVariableService ){}

  selectUser(user: any) {
    this.userSelected.emit(user);
    this.global.statusCheck=false;
    console.log(this.allUsers)
    
  }

  selectCurrentUser() {
    this.userCurrentSelected.emit(this.currentUserData); 
    this.global.statusCheck=true;    
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getUserById(this.userId);
    }
  }

  async getUserById(userId: string) {
    const userDocref = doc(this.firestore, 'users', userId);
    const userDoc = await getDoc(userDocref);
  
    if (userDoc.exists()) {
      this.currentUserData = {
        id: userDoc.id,
        ...userDoc.data() 
      };
      console.log(this.currentUserData);
    }
  }


  async getAllUsers() {
    const usersCollection = collection(this.firestore, 'users');
    onSnapshot(usersCollection, (snapshot) => {
      this.allUsers = [];
      snapshot.forEach((doc) => {
        this.checkUsersExsists = true;
        if (doc.id !== this.userId) {
          this.allUsers.push({ id: doc.id, ...doc.data()});
        }
      });
      console.log(this.allUsers);
    });
  }



  channelDrawerOpen: boolean = true;
  messageDrawerOpen: boolean = true;

  toggleChannelDrawer() {
    this.channelDrawerOpen = !this.channelDrawerOpen;
    console.log(this.channelDrawerOpen)
  }
  toggleMessageDrawer() {
    this.messageDrawerOpen = !this.messageDrawerOpen;
    console.log(this.messageDrawerOpen)
  }
}
