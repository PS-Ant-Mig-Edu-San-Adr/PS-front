import { Component } from '@angular/core';
import { RegisterService } from './register.component.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private registerService: RegisterService) {}

  closeLoginPopup() {
    this.registerService.closeRegisterPopup();
  }

  checkLogin() {
    this.registerService.register();
  }
}
