import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariableService {
  statusCheck:boolean=false;
  currentUserData: any = {};
  constructor() { }
}
