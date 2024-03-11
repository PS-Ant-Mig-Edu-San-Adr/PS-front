import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { AdminButtonsComponent } from '../admin-buttons/admin-buttons.component';
import { ManageActivitiesPopUpComponent } from '../manage-activities-pop-up/manage-activities-pop-up.component';
import { ManageActivitiesPopUpService } from '../manage-activities-pop-up/manage-activities-pop-up.service';

@Component({
  selector: 'app-admin-organizations',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent, ManageActivitiesPopUpComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-organizations.component.html',
  styleUrl: './admin-organizations.component.css'
})
export class AdminOrganizationsComponent implements  OnInit{
  constructor(public addActivitiesPopUP: ManageActivitiesPopUpService, public sharedService: SharedPopupsService, public loginService: LoginService, public registerService: RegisterService) {}
  
  ngOnInit() {
    this.sharedService.loginService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.registerService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.addActivitiesService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }
  addActivities(){
    this.addActivitiesPopUP.openAddActivityPopup();
  }



  @ViewChild('inputNoActive', { static: false }) inputNoActive!: ElementRef;


  toggleEditMode(inputElement: HTMLElement) {
    if (inputElement) {
      const inputId = inputElement.getAttribute('id');
  
      // Cambiar entre "noactive" y "active"
      const newId = inputId === 'noactive' ? 'active' : 'noactive';
      inputElement.setAttribute('id', newId);
  
      // Verificar el tipo de elemento y habilitar o deshabilitar la edición en consecuencia
      if (newId === 'active') {
        if (inputElement.tagName === 'INPUT') {
          (inputElement as HTMLInputElement).removeAttribute('readonly'); // Habilitar la edición
        } else if (inputElement.tagName === 'SELECT') {
          (inputElement as HTMLSelectElement).removeAttribute('disabled'); // Habilitar la edición
        }
      } else {
        if (inputElement.tagName === 'INPUT') {
          (inputElement as HTMLInputElement).setAttribute('readonly', 'true'); // Deshabilitar la edición
        } else if (inputElement.tagName === 'SELECT') {
          (inputElement as HTMLSelectElement).setAttribute('disabled', 'true'); // Deshabilitar la edición
        }
      }
    }  
  }
}


