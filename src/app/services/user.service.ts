import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private anonymousUser: User = new User({
    displayName: 'Guest',
    email: '',
    password: '',
    picture: '',
  });

  private currentUser: User = this.anonymousUser;
  private currentUserSubject = new Subject<User>();

  currentUser$ = this.currentUserSubject.asObservable();

  setCurrentUser(user: User | null) {
    if (user) {
      this.currentUser = user || this.anonymousUser;
      this.currentUserSubject.next(this.currentUser);
    }
  }

  getCurrentUser(): User {
    return this.currentUser;
  }
}
