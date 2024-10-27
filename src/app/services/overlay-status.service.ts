import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OverlayStatusService {
  private overlayStatus = new BehaviorSubject<boolean>(false);

  constructor() {}

  overlayStatus$ = this.overlayStatus.asObservable();

  setOverlayStatus(status: boolean) {
    this.overlayStatus.next(status);
  }

  getOverlayStatus(): boolean {
    return this.overlayStatus.value;
  }
}
