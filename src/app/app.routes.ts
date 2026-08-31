import { Routes } from '@angular/router';
import { Callback } from './component/callback/callback';
import { authGuard } from './guard/auth-guard';
import { Login } from './component/login/login';
import { Dashboard } from './component/dashboard/dashboard';
import { playlistsResolver } from './resolver/playlists-resolver';

export const routes: Routes = 
[
  { 
    path: 'callback', 
    component: Callback 
  },
  { 
    path: 'login', 
    component: Login 
  },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    resolve: 
    {
      resolvedPlaylists: playlistsResolver
    },
    canActivate: [authGuard] 
  },
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  }



/*     {
        path: '',
        component: PlManager,
        canActivate: [PlAuthguard]
    } ,
    {
        path: 'login',
        component: PlLogin,
    } */
    
    // {
    //     path: '',
    //     component: PlaylistManager,
    //     canActivate: [authorizeGuard]
    // }
    // ,
    // {
    //     path: 'authorize',
    //     component: Authorize,
    // }
];
