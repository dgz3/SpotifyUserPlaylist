import { Component, inject, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CustomSnackBar } from '../custom-snack-bar/custom-snack-bar';

type NotificationType = 'success'|'error'|'info';

@Component({
  imports: [],
  selector: 'app-notification-snack-bar',
  styleUrl: './notification-snack-bar.css',
  templateUrl: './notification-snack-bar.html',
})
export class NotificationSnackBar {

  private snackbar = inject(MatSnackBar);
  private duration = signal(0);
  private hpos = signal<MatSnackBarHorizontalPosition>('start');
  private vpos = signal<MatSnackBarVerticalPosition>('top');

  display(message: string, type: NotificationType): void {
    this.setDuration(type);
    this.setHPos(type);
    this.setVPos(type);

    this.snackbar.openFromComponent(
      CustomSnackBar,
      {
        duration: this.duration(),
        horizontalPosition: this.hpos(),
        verticalPosition: this.vpos(),
        panelClass: [`snackbar-${type}`],
        data: {
          message: message,
          type: type
        }
      }
    );
  }

  private setDuration(type: NotificationType): void {
    switch (type) {
      case 'success': this.duration.set(3500); break;
      case 'error'  : this.duration.set(9999); break;
      case 'info'   : this.duration.set(4500); break;
    }
  }

  private setHPos(type: NotificationType): void {
    switch (type) {
      case 'success': this.hpos.set('center'); break;
      case 'error'  : this.hpos.set('end');    break;
      case 'info'   : this.hpos.set('center'); break;
    }
  }

  private setVPos(type: NotificationType): void {
    switch (type) {
      case 'success': this.vpos.set('top'); break;
      case 'error'  : this.vpos.set('top');    break;
      case 'info'   : this.vpos.set('bottom'); break;
    }
  }
}