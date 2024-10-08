import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [MatCardModule,HeaderComponent],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

}
