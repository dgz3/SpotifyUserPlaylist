import { Component, signal } from '@angular/core';
import { AuthService } from '../../service/auth';
import { SpotifyService } from '../../service/spotify-service';
import { Track } from '../../model/track';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // listOfPlaylists = signal();
  
  constructor(private authService: AuthService,
              private spotifyService: SpotifyService) {}

  /* /me/tracks */
  loadUserTracks(): void {
    this.spotifyService.getUserTracks()
      .subscribe({
        next(tracks: Track[]) { 
          console.log(tracks);
        },
        error(err) { console.log(err) }
      });
  }

  /* /me */
  loadUserProfile(): void {
    this.spotifyService.getUserProfile()
      .subscribe({
        next(resp) { console.log(resp) },
        error(err) { console.log(err) }
      });
  }

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
