import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap, map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class LocationService {

    constructor(private http: HttpClient) {}

    getStates(): Observable<any> {
        if (window.navigator.onLine) {
            return this.http.get(`${environment.admin_prefix_url}/location/states`)
        }
    }

    getDistricts(stateID: number): Observable<any> {
        if (window.navigator.onLine) {
            return this.http.get(`${environment.admin_prefix_url}/location/districts/${stateID}`)
        }
    }

    getBlocks(distID: number): Observable<any> {
        if (window.navigator.onLine) {
            return this.http.get(`${environment.admin_prefix_url}/location/blocks/${distID}`)
        }
    }

    getPincodes(distID: number): Observable<any> {
      if (window.navigator.onLine) {
          return this.http.get(`${environment.admin_prefix_url}/location/getPincodes/${distID}`)
      }
  }

    getVillages(blockID: number): Observable<any> {
        if (window.navigator.onLine) {
            return this.http.get(`${environment.admin_prefix_url}/location/villages/${blockID}`)
        }
    }


    getAllDistricts(): Observable<any> {
        if (window.navigator.onLine) {
            return this.http.get(`${environment.admin_prefix_url}/location/allDistricts`)
        }
    }

    getAllBlocks(): Observable<any> {
        if (window.navigator.onLine) {
            return this.http.get(`${environment.admin_prefix_url}/location/allBlocks`)
        }
    }

    getAllVillages(): Observable<any> {
        if (window.navigator.onLine) {
            return this.http.get(`${environment.admin_prefix_url}/location/allVillages`)
        }
    }

    

    getOrganization(): Observable<any> {
      return this.http.get(`${environment.admin_prefix_url}/organization/getActiveOrganizations`);
    }


}
