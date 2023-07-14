import { AuthService } from './../screens/auth/services/auth.service';
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const userToken = this.authService.currentUserValue;
        if (userToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: userToken
                }
            });
        }
        return next.handle(request);
    }
}
