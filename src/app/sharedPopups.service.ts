import { Injectable } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { LoginService } from './login/login.component.service';
import { RegisterService } from './register/register.component.service';

@Injectable({
  providedIn: 'root',
})
export class SharedPopupsService {
  constructor(private renderer: Renderer2, private el: ElementRef, public loginService: LoginService, public registerService: RegisterService) {}

  toggleWrapperContainerStyles(success: boolean): void {
    const wrapperContainer = this.el.nativeElement.querySelector('#wrapper-container');

    if (wrapperContainer) {
      if (!success) {
        this.renderer.setStyle(wrapperContainer, 'filter', 'none');
        this.renderer.setStyle(wrapperContainer, 'pointer-events', 'auto');
      } else {
        this.renderer.setStyle(wrapperContainer, 'filter', 'blur(5px)');
        this.renderer.setStyle(wrapperContainer, 'pointer-events', 'none');
      }
    }
  }
}