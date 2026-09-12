import { Component, inject, input, OnInit, signal } from '@angular/core';
import { AuthService } from '../../service/auth-service';
import { SpotifyService } from '../../service/spotify-service';
import { Track } from '../../model/track';
import { Playlist } from '../../model/playlist';
import { PlaylistList } from "./playlist-list/playlist-list";
import { ProfileView } from "./profile-view/profile-view";
import { Profile } from '../../model/profile';
import { MatButton } from '@angular/material/button';
import { NotificationService } from '../../service/notification-service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [
    ProfileView,
    PlaylistList, 
    MatButton,
    MatIcon,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private notifyService = inject(NotificationService);

  resolvedPlaylists = input<Playlist[]>();
  resolvedProfile = input<Profile>();

  playlist = signal<Playlist | undefined>(undefined);
  downloadButtonLabel = signal<string | undefined>(undefined);

  // profile = signal<Profile | null>(null);
  
  constructor(private authService: AuthService,
              private spotifyService: SpotifyService) {}

  downloadFetchedTracks(): void 
  {
    const json = JSON.stringify(this.fetchedTracks(),null,2);
    const blob = new Blob([json], {type: 'application/json'});
    const blobUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = `${this.playlist()?.name.replaceAll(' ','_')}_${this.fetchedTimestamp()?.getTime()}.json`;

    anchor.click();

    window.URL.revokeObjectURL(blobUrl);
  }

  getPlaylist(playlist: Playlist | undefined): void 
  {
    if (playlist === undefined) return;

    this.playlist.set(playlist);
  }

  isLoading = signal(false);
  fetchedTracks = signal<Track[] | null>(null);
  fetchedTimestamp = signal<Date | null>(null);
  getTracks(): void 
  {
    const href = this.playlist()?.href;
    if (href) {
      this.isLoading.set(true);
      this.spotifyService.getPlaylistTracks(href)
        .subscribe({
          next: (resp) => { 
            console.log(resp);
            this.fetchedTracks.set(resp);
            this.fetchedTimestamp.set(new Date());
            this.downloadButtonLabel.set(
              `Download "${this.playlist()?.name}" as JSON`
            );
          },
          error: (err) => { 
            console.log(err);
            this.isLoading.set(false);
          },
          complete: () => { 
            this.notifyService.displaySuccess('Playlist successfully loaded!')
            this.isLoading.set(false);
          }
        });
    }
  }

  /* /me/playlists */
  loadPlaylists(): void 
  {
    this.spotifyService.getUserPlaylists()
      .subscribe({
        next(resp) { console.log(resp) },
        error(err) { console.log(err) }
      });
  }

  logout(): void 
  {
    this.authService.logout();
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
}
