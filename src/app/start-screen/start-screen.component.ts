import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { HeaderComponent } from '../header/header.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [MatCardModule, MatButtonModule,HeaderComponent],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

}
