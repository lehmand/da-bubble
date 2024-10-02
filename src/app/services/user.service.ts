import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: User | null = null;
  private currentUserSubject = new Subject<User | null>();

  currentUser$ = this.currentUserSubject.asObservable();

  setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}