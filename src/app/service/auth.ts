import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

   private clientId = 'f52991f223b242d385949eb2a569c5da';
  private redirectUri = 'http://127.0.0.1:4200/callback';
  private scopes = 'user-read-private user-read-email playlist-read-private';
  private tokenEndpoint = 'https://accounts.spotify.com/api/token';
  private authorizeEndpoint = 'https://accounts.spotify.com/authorize';

  constructor(private http: HttpClient, private router: Router) {}

  // --- PKCE Helpers ---

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values, v => chars[v % chars.length]).join('');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // --- Login Flow ---

  async login(): Promise<void> {
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store verifier for later use in token exchange
    sessionStorage.setItem('code_verifier', codeVerifier);
    localStorage.setItem('code_verifier', codeVerifier);

    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('response_type', 'code')
      .set('redirect_uri', this.redirectUri)
      .set('scope', this.scopes)
      .set('code_challenge_method', 'S256')
      .set('code_challenge', codeChallenge);

//    console.log(`${this.authorizeEndpoint}?${params.toString()}`);
    // Redirect to Spotify login page
    window.location.href = `${this.authorizeEndpoint}?${params.toString()}`;
  }

  // --- Token Exchange (called from callback component) ---

  async handleCallback(code: string): Promise<void> {
    const codeVerifier = sessionStorage.getItem('code_verifier');

    if (!codeVerifier) {
      throw new Error('No code verifier found. Login flow may have been interrupted.');
    }

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', this.redirectUri)
      .set('client_id', this.clientId)
      .set('code_verifier', codeVerifier);

    try {
      const response = await this.http.post<SpotifyTokenResponse>(
        this.tokenEndpoint,
        body.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      ).toPromise();

      this.storeTokens(response!);
      sessionStorage
      .removeItem('code_verifier');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Token exchange failed:', error);
      this.router.navigate(['/login']);
    }
  }

  // --- Token Management ---

  private storeTokens(tokens: SpotifyTokenResponse): void {
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('expires_at', expiresAt.toString());
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem('expires_at');
    return !!token && !!expiresAt && Date.now() < Number(expiresAt);
  }

  // --- Refresh Token ---

  async refreshAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return;
    }

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken)
      .set('client_id', this.clientId);

    try {
      const response = await this.http.post<SpotifyTokenResponse>(
        this.tokenEndpoint,
        body.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      ).toPromise();

      this.storeTokens(response!);
    } catch {
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    this.router.navigate(['/login']);
  }
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}
