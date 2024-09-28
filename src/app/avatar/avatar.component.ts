import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
avatarBox:string[]=[
  '../../assets/img/avatar/avatar1.png',
  '../../assets/img/avatar/avatar2.png',
  '../../assets/img/avatar/avatar3.png',
  '../../assets/img/avatar/avatar4.png',
  '../../assets/img/avatar/avatar5.png',
  '../../assets/img/avatar/avatar6.png',
]
}
