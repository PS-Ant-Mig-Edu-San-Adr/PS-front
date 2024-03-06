import { Injectable } from '@angular/core';
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private readonly API_URL = "";
  private readonly TEST_URL = "http://localhost:3001/api/";
  private readonly mode = false;

  private instance = axios.create({
    baseURL: this.mode ? this.API_URL : this.TEST_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() { }

  async register(email: string, password: string, firstName: string, lastName: string, username: string) {
    const res = await this.instance.post("/register", {
      email,
      password,
      firstName,
      lastName,
      username
    });
    return res.data;
  }

  async checkUsername(username: string) {
    const res = await this.instance.get(`/check-username/${username}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }

  async login(email: string, password: string) {
    const res = await this.instance.post("/login", {
      email,
      password,
    });
    return res.data;
  }


}
