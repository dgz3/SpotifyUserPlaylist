import { Routes } from '@angular/router';
import { PlManager } from './component/pl-manager/pl-manager';
import { PlAuthguard } from './service/pl-authguard';
import { PlLogin } from './component/pl-login/pl-login';

export const routes: Routes = 
[
    {
        path: '',
        component: PlManager,
        canActivate: [PlAuthguard]
    } ,
    {
        path: 'login',
        component: PlLogin,
    }
    
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
