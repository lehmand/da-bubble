import { Injectable } from '@angular/core';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  user: User = new User()

  getCreatedUser(){
    return this.user
  }

  
}
