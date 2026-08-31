import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { Track } from '../model/track';
import { Playlist } from '../model/playlist';

interface SpotifyPageResponse {
  items: any[];
  nextUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {

  readonly MS_PER_MIN: number = 60_000 as const;
  readonly MS_PER_SEC: number = 1_000  as const;

  private likedSongsPlaylist: Playlist = {
    name: 'Liked Songs',
    description: 'Liked songs or tracks (the basic checkmark)',
    href: 'https://api.spotify.com/v1/me/tracks'
  }
  
  constructor(private httpClient: HttpClient) {}

  getUserPlaylists(): Observable<Playlist[]> {
    const url = "https://api.spotify.com/v1/me/playlists";
    return(
      this.httpClient.get<any>(url).pipe(
        map(res => res.items.map((playlist: Playlist) => ({
          name: playlist.name,
          description: playlist.description,
          href: playlist.href
        }))) ,
        map((playlists: Playlist[]) => {
          return(
            [this.likedSongsPlaylist,...playlists]
          )
        })
      )
    );
  }

  getPlaylistTracks(url: string): Observable<Track[]> {
    const options = { params: { limit: 50 }};

    if (url != this.likedSongsPlaylist.href) {
      url += '/items'
    }

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
              let duration_ms = item.track.duration_ms;
              const min   = Math.trunc(duration_ms / this.MS_PER_MIN);
              duration_ms = duration_ms % this.MS_PER_MIN;
              const sec   = Math.ceil(duration_ms / this.MS_PER_SEC);
              const duration = (
                (min < 9 ? `0${min.toString()}` : `${min.toString()}`)
                + `:` +
                (sec < 9 ? `0${sec.toString()}` : `${sec.toString()}`)
              );
              
              return(
                {
                  name: item.track.name,
                  artist: item.track.artists[0].name,
                  album: item.track.album.name,
                  duration: duration,
                  added_at: item.added_at
                }
              )
                
            })
          );
        })
      )
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
              let duration_ms = item.track.duration_ms;
              const min   = Math.trunc(duration_ms / this.MS_PER_MIN);
              duration_ms = duration_ms % this.MS_PER_MIN;
              const sec   = Math.ceil(duration_ms / this.MS_PER_SEC);
              const duration = (
                (min < 9 ? `0${min.toString()}` : `${min.toString()}`)
                + `:` +
                (sec < 9 ? `0${sec.toString()}` : `${sec.toString()}`)
              );
              
              return(
                {
                  name: item.track.name,
                  artist: item.track.artists[0].name,
                  album: item.track.album.name,
                  duration: duration,
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
