import { Component, input, OnInit, signal } from '@angular/core';
import { AuthService } from '../../service/auth';
import { SpotifyService } from '../../service/spotify-service';
import { Track } from '../../model/track';
import { Playlist } from '../../model/playlist';
import { PlaylistList } from "./playlist-list/playlist-list";
import { ProfileView } from "./profile-view/profile-view";
import { Profile } from '../../model/profile';

@Component({
  selector: 'app-dashboard',
  imports: [PlaylistList, ProfileView],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  resolvedPlaylists = input<Playlist[]>();
  resolvedProfile = input<Profile>();

  private playlistUrl: string | null = null;

  // profile = signal<Profile | null>(null);
  
  constructor(private authService: AuthService,
              private spotifyService: SpotifyService) {}

  getPlaylist(playlistHref: string): void {
    console.log(playlistHref);
    this.playlistUrl = playlistHref;
  }

  getTracks(): void {
    if (this.playlistUrl) {
      this.spotifyService.getPlaylistTracks(this.playlistUrl)
        .subscribe({
          next(resp) { console.log(resp) },
          error(err) { console.log(err) }
        });
    }
  }

  /* /me/tracks */
  // loadUserTracks(): void {
  //   this.spotifyService.getUserTracks()
  //     .subscribe({
  //       next(tracks: Track[]) { 
  //         console.log(tracks);
  //       },
  //       error(err) { console.log(err) }
  //     });
  // }

  /* /me */
  // loadUserProfile(): void {
  //   this.spotifyService.getUserProfile()
  //     .subscribe({
  //       next: (resp) => {
  //         console.log(resp);
  //         this.profile.set(resp);
  //       },
  //       error: (err) => console.log(err) 
  //     });
  // }

  /* /me/playlists */
  loadPlaylists(): void {
    this.spotifyService.getUserPlaylists()
      .subscribe({
        next(resp) { console.log(resp) },
        error(err) { console.log(err) }
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
