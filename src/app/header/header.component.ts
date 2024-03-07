import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet],  
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.css'
  ]
})
export class HeaderComponent {

  constructor(private loginService: LoginService, private registerService: RegisterService) {}
  isLoggedIn: boolean = false;
  
  ngOnInit() {
    this.loginService.loginStatus$.subscribe((success: boolean) => {
      if (success) {
        this.isLoggedIn = true;
      }
    });
    this.registerService.registerStatus$.subscribe((success: boolean) => {
      if (success) {
        this.isLoggedIn = true;
      }
    });
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
