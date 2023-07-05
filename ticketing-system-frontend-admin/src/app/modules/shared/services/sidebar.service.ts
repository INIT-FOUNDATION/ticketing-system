import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private hideSideBar: BehaviorSubject<boolean>;
  private hideSideBar$: Observable<boolean>;
  constructor() {
    this.hideSideBar = new BehaviorSubject(true);
    this.hideSideBar$ = this.hideSideBar.asObservable();
  }

  get sidebarHidden(): Observable<boolean> {
    return this.hideSideBar$
  }

  set sidebarHiddenSet(is_hidden: boolean) {
    this.hideSideBar.next(is_hidden);
  }
}
