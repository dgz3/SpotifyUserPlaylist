import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return(
    next(req).pipe(
      catchError( (error: HttpErrorResponse) => {
        let errorMessage = `An unexpected error occurred: ${error.status}`;
        switch( error.status ) {
          case 0:
            errorMessage = 'Network issue. Check connection.';
            break;
          case 403:
            errorMessage = 'Forbidden operation by Spotify.'
        }

        // TODO: add toast
        console.log(errorMessage);

        return( throwError( () => new Error(errorMessage)) ) ;
      })
    )
  ) ;
};
