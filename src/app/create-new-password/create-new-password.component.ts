import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { getAuth, confirmPasswordReset } from "firebase/auth";
import { Firestore,doc,updateDoc} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { GlobalVariableService } from '../services/global-variable.service';

@Component({
  selector: 'app-create-new-password',
  standalone: true,
  imports: [FormsModule, MatCardModule, RouterModule, CommonModule],
  templateUrl: './create-new-password.component.html',
  styleUrl: './create-new-password.component.scss'
})
export class CreateNewPasswordComponent {
   constructor(public global:GlobalVariableService){}


  sendInfo: boolean = false;
  disabled: boolean = true;
  route = inject(ActivatedRoute);
  checkPasswordinfo: boolean = false;
  password: string = '';
  confirmPassword: string = '';
  oobCode: any;
  mode:any
  firestore = inject(Firestore);
  router=inject(Router);

  openDiv() {
    this.sendInfo = true;
    setTimeout(() => {
      this.sendInfo=false;
    }, 2000);
  } 

    resetFields():void{
      this.confirmPassword='';
      this.password=''
    }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'];
       this.mode=params['mode'];
      if(this.oobCode && this.mode==='resetPassword' ){
        console.log('Ok')
        this.global.createNewPassword = true;
      }
      
    });
  }

  checkPassworFields() {
    if (this.password && this.confirmPassword && this.password === this.confirmPassword) {
      this.disabled = false;
      this.checkPasswordinfo = false;
    } else {
      this.checkPasswordinfo = true;
      this.disabled = true;
    }
  }

  async createNewPassword() {
    const auth = getAuth();
    if (!this.oobCode) {
      return;
    }
    await confirmPasswordReset(auth, this.oobCode, this.password);
    const user = auth.currentUser;
    if(user){
      const userUID = user.uid;
    }
    this.sendInfo=true;
    this.resetFields();
    this.openDiv();
    this.router.navigate(['/']);
  } 







  
}