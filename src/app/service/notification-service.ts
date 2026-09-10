import { Injectable, signal } from '@angular/core';
import { NotificationSnackBar } from '../component/snackbar/notification-snack-bar/notification-snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notificationSnackBar = signal<NotificationSnackBar>(new NotificationSnackBar);

  displayError(message: string): void {
    this.notificationSnackBar().display(message,'error');
  }

  displayInfo(message: string): void {
    this.notificationSnackBar().display(message,'info');
  }

  displaySuccess(message: string): void {
    this.notificationSnackBar().display(message,'success');
  }
}
