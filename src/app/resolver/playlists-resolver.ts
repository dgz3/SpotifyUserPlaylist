import { ResolveFn } from '@angular/router';
import { SpotifyService } from '../service/spotify-service';
import { inject } from '@angular/core';
import { Playlist } from '../model/playlist';

export const playlistsResolver: ResolveFn<Playlist[]> = (route, state) => {
  const spotifyService = inject(SpotifyService);
  return(spotifyService.getUserPlaylists());
};
