import { Component, ElementRef, ViewChild, OnInit,  EventEmitter, Output } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../generalServices/auth-service/login.component.service';
import { RegisterService } from '../generalServices/auth-service/register.component.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { PerfilButtonsComponent } from '../perfil-buttons/perfil-buttons.component'
import { User } from '../interfaces/interface';
import { PerfilInfoDataCollector } from './perfil-info-data-collector';


@Component({
  selector: 'app-perfil-info',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, PerfilButtonsComponent],
  providers: [SharedPopupsService],
  templateUrl: './perfil-info.component.html',
  styleUrl: './perfil-info.component.css'

})
export class PerfilInfoComponent implements OnInit {
  constructor(public sharedService: SharedPopupsService, public loginService: LoginService, public registerService: RegisterService) {}

  active: number = 0;
  user: User | undefined;

  ngOnInit() {
    this.sharedService.loginService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.registerService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }


  @ViewChild('inputNoActive', { static: false }) inputNoActive!: ElementRef;


  toggleEditMode(inputElement: HTMLElement) {
    if (inputElement) {
      const inputClass = inputElement.getAttribute('class');


      const newClass = inputClass === 'noactive' ? 'active' : 'noactive';
      inputElement.setAttribute('class', newClass);

      if (newClass === 'active') {
        if (inputElement.tagName === 'INPUT') {
          (inputElement as HTMLInputElement).removeAttribute('readonly');
        } else if (inputElement.tagName === 'SELECT') {
          (inputElement as HTMLSelectElement).removeAttribute('disabled');
        }
      } else {
        if (inputElement.tagName === 'INPUT') {
          (inputElement as HTMLInputElement).setAttribute('readonly', 'true');
        } else if (inputElement.tagName === 'SELECT') {
          (inputElement as HTMLSelectElement).setAttribute('disabled', 'true');
        }
      }
    }
  }

  onModifyUserClick(): void {
    // Collect user data
    const userData = PerfilInfoDataCollector.collectUserData(this.user as User);

    // Check if all required fields are filled
    if (!userData.result) {
      alert(userData.details);
      return;
    }
    // Define the username and the URL for the POST request
    const username = this.user?.username;
    if (!username) {
      alert('Please log in before modifying your profile.');
      return;
    }
    // Modify the user

  }
}
