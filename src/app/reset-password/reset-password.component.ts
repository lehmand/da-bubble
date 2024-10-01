import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
 import {FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [MatCardModule, CommonModule,FormsModule,RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent  {

  sendInfo: boolean = false

   
  openDiv(){
    this.sendInfo=true;
    // setTimeout(() => {
    //   this.sendInfo=false;
    // }, 2000);
  }
}



