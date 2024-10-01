import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-new-password',
  standalone: true,
  imports: [FormsModule,MatCardModule,RouterModule,CommonModule],
  templateUrl: './create-new-password.component.html',
  styleUrl: './create-new-password.component.scss'
})
export class CreateNewPasswordComponent {

sendInfo:boolean=false;

openDiv(){
  this.sendInfo=true;
  setTimeout(() => {
    this.sendInfo=false;
  }, 2000);
}
}