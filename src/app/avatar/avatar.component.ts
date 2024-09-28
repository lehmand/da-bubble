import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {

}
