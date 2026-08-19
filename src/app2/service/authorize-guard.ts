import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthorizeService } from './authorize-service';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export const authorizeGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authorizeService = inject(AuthorizeService);
  const router = inject(Router);

  if(authorizeService.isLoggedIn()) return(true);

  return(router.createUrlTree(['/authorize']));
};
