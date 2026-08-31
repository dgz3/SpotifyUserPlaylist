import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { Playlist } from '../../../model/playlist';

@Component({
  selector: 'app-playlist-list',
  imports: [],
  templateUrl: './playlist-list.html',
  styleUrl: './playlist-list.css',
})
export class PlaylistList {
  playlists = input<Playlist[]>();
  playlist = output<string>();

  constructor() {
    effect( () => {
      const initialValue = this.playlists();
      this.playlist.emit(initialValue!.at(0)!.href);
    });
  }

  displayPlaylist(playlistId: string): void {
    // console.log(playlistId);
    this.playlist.emit(playlistId);
  }
}
