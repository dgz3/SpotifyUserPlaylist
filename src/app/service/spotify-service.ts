import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { Track } from '../model/track';

interface SpotifyPageResponse {
  items: any[];
  nextUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  
  constructor(private httpClient: HttpClient) {}

  getUserPlaylists(): Observable<any> {
    return(
      this.httpClient.get<any>("https://api.spotify.com/v1/me/playlists")
    );
  }

  getUserProfile(): Observable<any> {
    return(
      this.httpClient.get<any>("https://api.spotify.com/v1/me")
    );
  }

  getUserTracks(): Observable<Track[]> {
    const options = { params: { limit: 50 }};
    const url = "https://api.spotify.com/v1/me/tracks";
    return(
      this.httpClient.get<any>(url, options).pipe(

        map(res => ({
          items: res.items || [],
          nextUrl: res.next || null
        })), 

        expand( (lastpage: SpotifyPageResponse) => {
          if (!lastpage.nextUrl) return(EMPTY);

          return(
            this.httpClient.get<any>(lastpage.nextUrl, options).pipe(
              map(res => ({
                items: res.items || [],
                nextUrl: res.next || null
              })), 
            )
          );
        }),

        reduce( (accumulated: any[], currentPage: SpotifyPageResponse) => {
          return([...accumulated, ...currentPage.items])
        }, []),

        map( (rawTracks: any[]) => {
          return(
            rawTracks.map( (item: any) => {
              return(
                {
                  name: item.track.name,
                  artist: item.track.artists[0].name,
                  album: item.track.album.name,
                  added_at: item.added_at 
                }
              )
                
            })
          );
        })
      )
    );
  }
}
