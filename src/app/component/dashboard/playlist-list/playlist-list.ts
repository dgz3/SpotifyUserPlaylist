import { Component, computed, effect, input, linkedSignal, OnInit, output, signal } from '@angular/core';
import { Playlist } from '../../../model/playlist';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { toObservable } from '@angular/core/rxjs-interop';
import { first, take } from 'rxjs';

@Component({
  selector: 'app-playlist-list',
  imports: [
    MatSelect,
    MatOption,
    MatLabel,
    MatFormField,
  ],
  templateUrl: './playlist-list.html',
  styleUrl: './playlist-list.css',
})
export class PlaylistList {
  playlists = input<Playlist[]>();
  playlist = output<string>();

  selectedPlaylist = linkedSignal( () => this.playlists()?.[0].href );

  constructor() 
  { 
    this.autoEmitFirstPlaylist();
  }

  autoEmitFirstPlaylist(): void
  {
    effect( () => {
      const initialValues = this.playlists() ?? [];
      this.playlist.emit(
        (initialValues.length > 0) ? initialValues[0].href 
                                   : 'ERROR: playlist url not found'
      );
    });
  }
}
