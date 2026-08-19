import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {

  private apiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient){}

  private getHeaders(): HttpHeaders{
    const token = localStorage.getItem('access_token');
    return(
      new HttpHeaders({ Authorization: `Bearer ${token}`, })
    );
  }
  
  getUserData(): Observable<any>{
    const { access_token , refresh_token , expires_in } = JSON.parse(localStorage.getItem('auth_object')!);
    // const access_token = auth_obj?.at(0);
    // console.log('auth_obj -> ', auth_obj);
    // console.log('auth_obj[0] -> ', auth_obj?.at(0));
    console.log('access_token: ', access_token);
    const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + access_token,
    });

    return(
        this.http.get<any>('https://api.spotify.com/v1/me',{headers})
    );     
  }

  getPlaylistData(): Observable<any>{
    const userId = 'dellytyme';
    const { access_token , refresh_token , expires_in } = JSON.parse(localStorage.getItem('auth_object')!);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token,
    });
    // const params = new HttpParams()
    //     .set('scope','playlist-read-private');

    return(
      this.http.get<any>(`https://api.spotify.com/v1/me/playlists`, { headers: headers, })
    );
  }    

  getUserTracks(): Observable<any>{
    const { access_token , refresh_token , expires_in } = JSON.parse(localStorage.getItem('auth_object')!);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token,
    });

    return(
      this.http.get<any>(`https://api.spotify.com/v1/me/tracks`, { headers: headers, })
      );
  }

  getNextTracksPage(url: string): Observable<any>{
    const { access_token , refresh_token , expires_in } = JSON.parse(localStorage.getItem('auth_object')!);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token,
    });

    return(
      this.http.get<any>(`${url}`, { headers: headers, } )
    );
  }    

}
