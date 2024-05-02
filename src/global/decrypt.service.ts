import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class DecryptService {
  private readonly secretKey = 'robotic';

  encrypt(data: any) {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();
    return { response: encryptedData };
  }

  decrypt(encryptedData: string): any {
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      this.secretKey
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}
