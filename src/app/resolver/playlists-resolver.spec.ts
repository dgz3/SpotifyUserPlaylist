import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { playlistsResolver } from './playlists-resolver';

describe('playlistsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => playlistsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
