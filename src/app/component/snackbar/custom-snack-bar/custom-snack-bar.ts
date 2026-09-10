import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

interface inData {
  message: string;
  type: 'success'|'error'|'info';
}

@Component({
  imports: [
    MatIcon,
  ],
  selector: 'app-custom-snack-bar',
  styleUrl: './custom-snack-bar.css',
  templateUrl: './custom-snack-bar.html',
})
export class CustomSnackBar {
  data = inject<inData>(MAT_SNACK_BAR_DATA)
}
