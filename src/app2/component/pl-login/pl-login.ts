import { Component } from '@angular/core';
import { AuthorizeService } from '../../service/authorize-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pl-login',
  imports: [],
  templateUrl: './pl-login.html',
  styleUrl: './pl-login.css',
})
export class PlLogin {

  private readonly clientId = 'f52991f223b242d385949eb2a569c5da';
  private readonly redirectUri = 'http://127.0.0.1:4200/login';

  private codeChallenge: string = '';

  constructor(private authorizeService: AuthorizeService
             ,private router: Router) { }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnedCode = urlParams.get('code');

    if (returnedCode) {
      const codeVerifier = localStorage.getItem('code_verifier');

      // get token using client-side code verifier + server-side token code
      if (codeVerifier && returnedCode) {
        this.authorizeService
          .getToken(codeVerifier, returnedCode)
          .subscribe({
            next: (token) => {
              this.authorizeService.setToken(token);
            }
            ,
            complete: () => {
              this.router.navigate(['']);
            }
          });
      }

    }
  }

  login(): void {
        // generate code verifier
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(128));
    const codeVerifier = values.reduce((acc, x) => acc + possible[x % possible.length], "");

    // generate code challenge and request server for token code
    this.authorizeService.sha256(codeVerifier)
      .then((hashed) => {

        this.codeChallenge = this.authorizeService.base64encode(hashed);
        localStorage.setItem('code_verifier', codeVerifier);

        const authUrl = new URL('https://accounts.spotify.com/authorize');
        const params = {
          'response_type': 'code',
          'client_id': this.clientId,
          // 'scope': 'user-library-read user-read-private user-read-email playlist-read-private playlist-read-collaborative',
          'scope': 'user-library-read user-read-private user-read-email',
          'redirect_uri': this.redirectUri,
          'code_challenge': this.codeChallenge,
          'code_challenge_method': 'S256',
        }

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
      });
  }
}
