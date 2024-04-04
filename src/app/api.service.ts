import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  async register(body: any) {
    try {
      const response = await axios.post(
        `http://localhost:3003/auth/register`,
        body
      );
      return response;
    } catch (error) {
      return error;
    }
  }

}
