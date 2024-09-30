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
  isHovered: boolean = false;
  isClicked: boolean = false;
  isChecked: boolean = false;

  toggleClicked(){
    this.isClicked = !this.isClicked;
  }

  toggleChecked(){
    this.isChecked = !this.isChecked
    console.log(this.isChecked)
  }

  toggleHover(){
    this.isHovered = !this.isHovered;
  }
}
