import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../modules/shared/services/loader.service';
import { environment } from 'src/environments/environment';

const noLoaderApis: string | string[] = [];
const loaderRequireGetApi: string | string[] = [];

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    // this.requests.length > 0 ? this.loaderService.showLoading() : this.requests.length == 0 ? this.loaderService.hideLoading() : null;
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      loaderRequireGetApi.includes(req.url) ||
      req.url.indexOf(loaderRequireGetApi[3]) != -1
    ) {
    } else {
      if (req.method === 'GET') {
        return next.handle(req);
      }
    }
    if (noLoaderApis.includes(req.url)) {
      return next.handle(req);
    }
    this.requests.push(req);
    this.loaderService.isLoading.next(true);
    return Observable.create(
      (observer: {
        next: (arg0: HttpResponse<any>) => void;
        error: (arg0: any) => void;
        complete: () => void;
      }) => {
        const subscription = next.handle(req).subscribe(
          (event) => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
            }
          },
          (err) => {
            this.removeRequest(req);
            observer.error(err);
          },
          () => {
            this.removeRequest(req);
            observer.complete();
          }
        );
        // remove request from queue when cancelled
        return () => {
          this.removeRequest(req);
          subscription.unsubscribe();
        };
      }
    );
  }
}
