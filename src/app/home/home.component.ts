import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { StartScreenComponent } from '../start-screen/start-screen.component';
import { ThreadComponent } from '../thread/thread.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    WorkspaceComponent,
    StartScreenComponent,
    ThreadComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  selectedUser: any;
  selectedChannel: any;  mentionUser:any;

  onUserSelected(user: any) {
    this.selectedUser = user;
    this.selectedChannel = null;
  }     
 
  onChannelSelected(channel: any) {
    this.selectedChannel = channel;
    this.selectedUser = null
  }

  ngOnInit(): void {
    
  }

}
