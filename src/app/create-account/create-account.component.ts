import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  constructor(){}

  isDefault: boolean = true;
  isClicked: boolean = false;

}
