import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SpotifyService } from '../service/spotify-service';
import { Profile } from '../model/profile';

export const profileResolver: ResolveFn<Profile> = (route, state) => {
  const spotifyService = inject(SpotifyService);
  return(spotifyService.getUserProfile());
};
