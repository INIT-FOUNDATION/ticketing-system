import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({providedIn: 'root'})
export class EncDecService {

  private keys = 'INIT@$#&*(!@%^&';

  constructor() {}

  set(value){
    var ciphertext = CryptoJS.AES.encrypt(value, this.keys).toString();
    return ciphertext;
  }

  setWithDynamicKey(value, ts){
    const dynamicKey = this.keys + ts;
    var ciphertext = CryptoJS.AES.encrypt(value, dynamicKey).toString();
    return ciphertext;
  }

  //The get method is use for decrypt the value.
  get(value){
    var decrypted = CryptoJS.AES.decrypt(value, this.keys);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
