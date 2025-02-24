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
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const userToken = sessionStorage.getItem('userToken');
        if (userToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: JSON.parse(userToken)
                }
            });
        }
        return next.handle(request);
    }
}
