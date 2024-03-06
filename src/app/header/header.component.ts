import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.css'
  ]
})
export class HeaderComponent {

  @Output() openLogin = new EventEmitter<void>();

    isLoggedIn: boolean = false;

    login() {
      // Lógica para el botón de login
      console.log('Login clicked');
      this.isLoggedIn = true;
      this.openLogin.emit();
    }
  
    register() {
      // Lógica para el botón de register
      console.log('Register clicked');
    }

    isUserLoggedIn(): boolean {
      return this.isLoggedIn;
    }

}
