import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private profilePicSubject: BehaviorSubject<any>;
  public profilePic: Observable<any>;
  constructor(private http: HttpClient) {
    this.profilePicSubject = new BehaviorSubject(null);
    this.profilePic = this.profilePicSubject.asObservable();
  }

  setSummaryValues: any = [];

  set summaryDetails(value) {
    this.setSummaryValues = value;
  }

  get summaryDetails() {
    return this.setSummaryValues;
  }

  setProfilePic(data: any) {
    this.profilePicSubject.next(data);
  }


  getProfilePic() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    // return this.http
    //   .post<Blob>(
    //     `${environment.registration_prefix_url}/patient/downloadProfilePic`,
    //     {},
    //     { headers, responseType: 'blob' as 'json' }
    //   )
    //   .pipe(
    //     map(async (data) => {
    //       if (data) {
    //         let blobUrl = await this.blobToDataURL(data);
    //         this.setProfilePic(blobUrl);
    //         return blobUrl;
    //       } else {
    //         return 'assets/Profile-photo.svg';
    //       }
    //     })
    //   );
  }

  blobToDataURL(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = this.getFileReader();
      reader.onload = (_e) => resolve(reader.result as string);
      reader.onerror = (_e) => reject(reader.error);
      reader.onabort = (_e) => reject(new Error('Read aborted'));
      reader.readAsDataURL(blob);
    });
  }

  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)[
      '__zone_symbol__originalInstance'
    ];
    return zoneOriginalInstance || fileReader;
  }
}
