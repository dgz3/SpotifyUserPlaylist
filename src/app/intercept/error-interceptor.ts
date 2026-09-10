import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../service/notification-service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifyService = inject(NotificationService);
  return(
    next(req).pipe(
      catchError( (error: HttpErrorResponse) => {
        let errorMessage = `An unexpected error occurred: ${error.status}`;
        switch( error.status ) {
          case 0:
            errorMessage = `Network issue. Check connection. (${error.status})`;
            break;
          case 403:
            errorMessage = `Spotify API does not allow loading playlists owned by other users. (${error.status})`
        }

        notifyService.displayError(errorMessage);

        return( throwError( () => new Error(errorMessage)) ) ;
      })
    )
  ) ;
};
