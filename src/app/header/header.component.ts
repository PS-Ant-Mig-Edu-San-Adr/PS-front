import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {SessionStorageService} from "angular-web-storage";
import {Subscription} from 'rxjs'; // Import Subscription from rxjs
import {User} from '../interfaces/interface';
import {AuthService} from "../generalServices/auth-service/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.css'
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []; // Declare subscriptions array

  constructor(
              private authService: AuthService,
              private sessionStorageService: SessionStorageService) {}
  isLoggedIn: boolean = false;
  profile: User | undefined;
  profilePict: String = 'https://www.w3schools.com/howto/img_avatar.png';

  ngOnInit() {
    const loginStatusSubscription = this.authService.loginStatus$().subscribe((success: boolean) => {
      if (success) {
        this.isLoggedIn = true;
      }
    });
    this.subscriptions.push(loginStatusSubscription);

    const loginObjectSubscription = this.authService.loginObject$().subscribe((user: User) => {
      this.profile = user;
      this.profilePict = this.sessionStorageService.get('profilePict');
    });
    this.subscriptions.push(loginObjectSubscription);

    const registerStatusSubscription = this.authService.registerStatus$().subscribe((success: boolean) => {
      if (success) {
        this.isLoggedIn = true;
      }
    });
    this.subscriptions.push(registerStatusSubscription);

    const registerObjectSubscription = this.authService.registerObject$().subscribe((user: User) => {
      this.profile = user;
      this.profilePict = this.sessionStorageService.get('profilePict');
    });
    this.subscriptions.push(registerObjectSubscription);

    this.isLoggedIn = this.sessionStorageService.get('token');
    this.profilePict = this.sessionStorageService.get('profilePict');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  login() {
    this.authService.openLoginPopup();
  }

  register() {
    this.authService.openRegisterPopup();
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
