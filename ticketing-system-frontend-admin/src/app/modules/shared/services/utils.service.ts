import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HostListener } from "@angular/core";
import * as _moment from 'moment';

import { MatDialog } from '@angular/material/dialog';
const moment = _moment;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  scrHeight:any;
    scrWidth:any;
  constructor(
    private tostr: ToastrService,
    //public loadingController: LoadingController,
    private ngtoastr: ToastrService,
    private dialog: MatDialog
  ) { }

  removeEmptyObjects(obj: any) {
    return Object.keys(obj)
      .filter(k => obj[k] !== '' && obj[k] !== null && obj[k] !== undefined)  // Remove undef. and null.
      .reduce((newObj, k) =>
        typeof obj[k] === 'object' ?
          Object.assign(newObj, { [k]: this.removeEmptyObjects(obj[k]) }) :  // Recurse.
          Object.assign(newObj, { [k]: obj[k] }),  // Copy value.
        {});
  }

  parseJson(str) {
    try {
      const json = JSON.parse(str);
      return (typeof json === 'object' ? json : str);
    } catch (e) {
      return str;
    }
  }

  isPresent(str): boolean {
    if (str === '' || str === null || str === undefined) {
      return false;
    }
    return true;
  }

  blobToDataURL(blob, callback) {
    const a = new FileReader();
    a.onload = (e) => { callback(e.target.result); };
    a.readAsDataURL(blob);
  }

  showErrorToast(msg) {
    this.tostr.error(msg, 'Error');
  }

  showSuccessToast(msg) {
    this.tostr.success(msg, 'Success');
  }

  showWarningToast(msg) {
    this.tostr.warning(msg, 'Warning');
  }

  showInfoToast(msg) {
    this.tostr.info(msg, 'Info');
  }

  parseToJsonObject(res) {
    let body = [];
    let newRes;
    if (Array.isArray(res)) {
      newRes = res;
    } else {
      newRes = res['list1'];
    }
    try {
      newRes.forEach((element, index) => {
        const parseObject = JSON.parse(element);
        if (this.isPresent(parseObject.lastLoggedInOut)) {
          parseObject.lastLoggedInOut = moment(parseObject.lastLoggedInOut).add(330, 'minutes').toDate();
        }
        if (this.isPresent(parseObject.pincode)) {
          let pincode = '' + parseObject.pincode;
          if (pincode.length < 6) {
            parseObject.pincode = pincode.padStart(6, '0');
          }
        }
        body.push(parseObject);
      });
    } catch {
      for (const obj of newRes) {
        if (this.isPresent(obj.lastLoggedInOut)) {
          obj.lastLoggedInOut = moment(obj.lastLoggedInOut).add(330, 'minutes').toDate();
        }
        if (this.isPresent(obj.date_of_session)) {
          obj.date_of_session = new Date(obj.date_of_session);
        }
        if (this.isPresent(obj.start_time)) {
          obj.start_time = new Date(obj.start_time);
        }
        if (this.isPresent(obj.end_time)) {
          obj.end_time = new Date(obj.end_time);
        }
        if (this.isPresent(obj.pincode)) {
          let pincode = '' + obj.pincode;
          if (pincode.length < 6) {
            obj.pincode = pincode.padStart(6, '0');
          }
        }
      }
      body = newRes;
    }
    if (!Array.isArray(res) && res['list2']) {
      for (const obj of res['list2']) {
        if (this.isPresent(obj.lastLoggedInOut)) {
          obj.lastLoggedInOut = moment(obj.lastLoggedInOut).add(330, 'minutes').toDate();
        }
        if (this.isPresent(obj.date_of_session)) {
          obj.date_of_session = new Date(obj.date_of_session);
        }
        if (this.isPresent(obj.start_time)) {
          obj.start_time = new Date(obj.start_time);
        }
        if (this.isPresent(obj.end_time)) {
          obj.end_time = new Date(obj.end_time);
        }
        if (this.isPresent(obj.pincode)) {
          let pincode = '' + obj.pincode;
          if (pincode.length < 6) {
            obj.pincode = pincode.padStart(6, '0');
          }
        }
      }
      body = body.concat( res['list2']);
    }
    console.log("body", body)
    return body;
  }

  sortComparer(reference: string, comparer: string) {
    if (reference == null || reference === undefined) {
      reference = '';
    }
    if (comparer == null || comparer === undefined) {
      comparer = '';
    }
    if (reference.toString().trim().toLowerCase() < comparer.toString().trim().toLowerCase()) {
      return -1;
    }
    if (reference.toString().trim().toLowerCase() > comparer.toString().trim().toLowerCase()) {
      return 1;
    }
    return 0;
  }

  handleGridData(res, reqType) {
    if (reqType === 'add') {
      return this.parseToJsonObject(res).sort((a, b) => this.sortComparer(a.date_created, b.date_created)).reverse();
    } else if (reqType === 'edit') {
      return this.parseToJsonObject(res).sort((a, b) => this.sortComparer(a.date_modified, b.date_modified)).reverse();
    } else {
      return this.parseToJsonObject(res);
    }
  }

  replaceSpaceToUnderscore(str) {
    return str.replace(/ /g, '_');
  }

  replaceHyphenToUnderscore(str) {
    return str.replace(/-/g, '_');
  }

  shortNumber(value) {
    if (value === null) { return null; }
    if (value === 0) { return '0'; }
    const fractionSize = 1;
    let abs = Math.abs(value);
    const rounder = Math.pow(10, fractionSize);
    const isNegative = value < 0;
    let key = '';
    const powers = [{ key: 'Q', value: Math.pow(10, 15) }, { key: 'T', value: Math.pow(10, 12) }, { key: 'B', value: Math.pow(10, 9) }, { key: 'M', value: Math.pow(10, 6) }, { key: 'k', value: 1000 }];
    for (let i = 0; i < powers.length; i++) {
      let reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + abs + key;
  }

  wordwrap(str, width, spaceReplacer) {
    if (str.length > width) {
      let p = width;
      for (; p > 0 && str[p] !== ' '; p--) {
      }
      if (p > 0) {
        const left = str.substring(0, p);
        const right = str.substring(p + 1);
        return left + spaceReplacer + this.wordwrap(right, width, spaceReplacer);
      }
    }
    return str;
  }

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.scrHeight = window.innerHeight;
          this.scrWidth = window.innerWidth;
          return window.innerWidth;
          console.log(this.scrHeight, this.scrWidth);
    }


    // presentSmllDurationLoading() {
    //   return this.loadingController.create({
    //     duration: 100
    //   });
    // }

    async presentToastError(toastMessage, position?) {
      this.ngtoastr.error(toastMessage,null,{
        timeOut: 3000,
        positionClass:'toast-bottom-left',
        closeButton:true
      });
    }

    // presentLoading() {
    //   return this.loadingController.create({
    //     cssClass: 'my-custom-class',
    //   //  message: 'Please wait...',
    //     duration: 2000
    //   });
    // }

    // openPrescriptionDialog(payload) {
    //   const dialogRef = this.dialog.open(CommonPrescriptionDialogComponent,
    //     {
    //       data: payload,
    //       width: '70%',
    //       height:'620px',
    //       disableClose: true,
    //       panelClass: 'my-dialog',
    //     }
    //   );

    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log(`Dialog result: ${result}`);
    //   });
    // }

    b64toBlob = (b64Data, contentType='', sliceSize=512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }
}
