import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageHeaderService {

  private pageHeaderSubject: BehaviorSubject<string>;
  private pageHeader$: Observable<string>;
  public backButtonRequired = true;
  constructor() {
    this.pageHeaderSubject = new BehaviorSubject(null);
    this.pageHeader$ = this.pageHeaderSubject.asObservable();
  }

  get pageHeader(): Observable<string> {
    return this.pageHeader$
  }

  set pageHeaderSet(header: string) {
    this.pageHeaderSubject.next(header);
  }
}
