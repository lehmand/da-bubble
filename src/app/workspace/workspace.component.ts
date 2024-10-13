import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent {
  constructor() {
    
  }
  channelDrawerOpen: boolean = true;
  messageDrawerOpen: boolean = true;

  toggleChannelDrawer(){
    this.channelDrawerOpen = !this.channelDrawerOpen;
    console.log(this.channelDrawerOpen)
  }
  toggleMessageDrawer(){
    this.messageDrawerOpen = !this.messageDrawerOpen;
    console.log(this.messageDrawerOpen)
  }
}
