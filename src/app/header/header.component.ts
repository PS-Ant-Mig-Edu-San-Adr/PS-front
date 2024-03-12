import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';
import { RouterOutlet } from '@angular/router';
import { SessionStorageService } from "angular-web-storage";
import { Subscription } from 'rxjs'; // Import Subscription from rxjs
import { User } from '../interfaces/interface';

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

  constructor(private loginService: LoginService,
              private registerService: RegisterService,
              private sessionStorageService: SessionStorageService) {}
  isLoggedIn: boolean = false;
  profile: User | undefined;
  profilePict: String = 'https://www.w3schools.com/howto/img_avatar.png';

  ngOnInit() {
    const loginStatusSubscription = this.loginService.loginStatus$.subscribe((success: boolean) => {
      if (success) {
        this.isLoggedIn = true;
      }
    });
    this.subscriptions.push(loginStatusSubscription);

    const loginObjectSubscription = this.loginService.loginObject$.subscribe((user: User) => {
      this.profile = user;
      this.profilePict = this.sessionStorageService.get('profilePict');
    });
    this.subscriptions.push(loginObjectSubscription);

    const registerStatusSubscription = this.registerService.registerStatus$.subscribe((success: boolean) => {
      if (success) {
        this.isLoggedIn = true;
      }
    });
    this.subscriptions.push(registerStatusSubscription);

    const registerObjectSubscription = this.registerService.registerObject$.subscribe((user: User) => {
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
    this.loginService.openLoginPopup();
  }

  register() {
    this.registerService.openRegisterPopup();
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
