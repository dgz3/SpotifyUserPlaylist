import { Component } from '@angular/core';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login();
  }
}
