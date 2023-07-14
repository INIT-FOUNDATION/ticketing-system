import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ErrorCodes } from './error-codes.module';

import { ToastrService } from '../modules/shared/services/toastr.service';
import { AuthService } from '../screens/auth/services/auth.service';

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  unAuthorizedErrorOccurred = false;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((error) => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
    }

    const isJson = (str: string) => {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    };

    if (response instanceof HttpErrorResponse) {
      switch (response.status) {
        case 401: // login
          if (!this.unAuthorizedErrorOccurred) {
            this.unAuthorizedErrorOccurred = true;
            if (this.authService.currentUserValue) {
              this.router.navigateByUrl('/login');
            }
            setTimeout(() => {
              this.authService.signOut();
            }, 1000);
          } else {
            this.router.navigateByUrl('/login');
          }
          break;
        case 403: // forbidden
          this.router.navigateByUrl('/forbidden');
          break;
        case 409:
        case 400:
          if (response.error) {
            if (typeof response.error === 'string') {
              if (isJson(response.error)) {
                const errmsg = JSON.parse(response.error);
                if (errmsg.errorCode) {
                  let errorCode: any = errmsg.errorCode;
                  const errorMessage: any = ErrorCodes[errorCode];
                  if (errorMessage) {
                    this.toastr.presentErrorToast('bottom', errorMessage);
                  } else {
                    this.toastr.presentErrorToast('bottom', errmsg.error);
                  }
                } else {
                  this.toastr.presentErrorToast('bottom', response.error);
                }
              } else {
                this.toastr.presentErrorToast('bottom', response.error);
              }
            } else {
              try {
                this.toastr.presentErrorToast('bottom', response.error.error);
              } catch (e) {
                console.error('Error!!! ', e);
              }
            }
          } else {
            this.toastr.presentErrorToast('bottom', response.error);
          }

          break;
        case 0:
          if (window.navigator.onLine) {
            this.toastr.presentErrorToast(
              'bottom',
              'Something went wrong. Please try again!'
            );
            break;
          } else if (!window.navigator.onLine) {
            this.toastr.presentErrorToast(
              'bottom',
              'Something went wrong. Please try again!'
            );
            break;
          } else {
            break;
          }
      }
    }
    throw response;
  }
}
