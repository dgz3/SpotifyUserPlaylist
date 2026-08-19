import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyToken } from '../model/spotify-token';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  private readonly clientId = 'f52991f223b242d385949eb2a569c5da';
  private readonly redirectUri = 'http://127.0.0.1:4200/login';
  private readonly tokenUrl = 'https://accounts.spotify.com/api/token';
  private readonly authorizeUrl = new URL('https://accounts.spotify.com/authorize');
  private readonly STORAGE_KEY = 'spotify_token';
  private token: SpotifyToken | null = null;

  constructor(private http: HttpClient) { }

  generateCodeVerfier(length: number): any {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }

  sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }

  base64encode(input: any): any {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  getAccessToken(): void {
    const codeVerifier = this.generateCodeVerfier(64);

    this.sha256(codeVerifier)
      .then((hashed: any) => {
        const codeChallenge = this.base64encode(hashed);

        localStorage.setItem('code_verifier', codeVerifier);
        
        const params = {
          'response_type': 'code',
          'client_id': this.clientId,
          // 'scope': 'user-library-read user-read-private user-read-email playlist-read-private playlist-read-collaborative',
          'scope': 'user-library-read user-read-private user-read-email',
          'redirect_uri': this.redirectUri,
          'code_challenge': codeChallenge,
          'code_challenge_method': 'S256',
        }

        this.authorizeUrl.search = new URLSearchParams(params).toString();
        window.location.href = this.authorizeUrl.toString();
      })
      .catch((error: string) => {
        console.log('promise caught error : ', error);
      });
  }

  setToken(token: SpotifyToken){
    this.token = token;
    this.token.expires_at = (Math.floor(Date.now()/1000) + this.token.expires_in) * 1000;
    localStorage.setItem(this.STORAGE_KEY,JSON.stringify(token));
  }

  isLoggedIn(): boolean{
    const storedData =localStorage.getItem(this.STORAGE_KEY);
    const tokenObject = ( storedData ? JSON.parse(storedData) : null );

    if (!tokenObject) return(false);

    if (!tokenObject.expires_at) return(false);

//    return( Date.now() < this.token.expires_at - 60000 );
//    return( Date.now() < this.token.expires_at );    

    const isExpired =  tokenObject.expires_at < Date.now();

    if (isExpired){
      localStorage.clear();
      return(false);
    }

    return(true);    
  }

  getToken(codeVerifier: string, returnedCode: string): Observable<SpotifyToken>{
    console.log('(>*.*)>---o/o/o  getToken()')
    console.log('code verfier: ', codeVerifier);
    console.log('server code: ', returnedCode);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('grant_type', 'authorization_code')
      .set('code', returnedCode)
      .set('redirect_uri', this.redirectUri)
      .set('code_verifier', codeVerifier);

    return (this.http.post<SpotifyToken>(this.tokenUrl, body.toString(), { headers }));
  }

}
