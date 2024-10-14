import { CommonModule, } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, getDoc, getDocs,onSnapshot } from '@angular/fire/firestore';

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
  userData: any = {};
  allUsers: any = [];
  checkUsersExsists:boolean=false;

  ngOnInit(): void {
    this.getAllUsers();
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getUserById(this.userId);
    }
  }


  async getUserById(userId: string) {
    const userDocref = doc(this.firestore, 'users', userId)
    const userDoc = await getDoc(userDocref)
    if (userDoc.exists()) {
      this.userData = userDoc.data();
    }
  }


  async getAllUsers() {
    const usersCollection = collection(this.firestore, 'users');
      onSnapshot(usersCollection, (snapshot) => {
      this.allUsers = [];
      snapshot.forEach((doc) => {
         this.checkUsersExsists=true;
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
