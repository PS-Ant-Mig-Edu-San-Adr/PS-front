import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.css'
  ]
})
export class HeaderComponent {

  @Output() openLogin = new EventEmitter<void>();
  @Output() openRegister = new EventEmitter<void>();
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
      // Lógica para el botón de login
      console.log('Login clicked');
      this.openLogin.emit();
    }
  
    register() {
      // Lógica para el botón de register
      console.log('Register clicked');
      this.openRegister.emit();
    }

    isUserLoggedIn(): boolean {
      return this.isLoggedIn;
    }

}
