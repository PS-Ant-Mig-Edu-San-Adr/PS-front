import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { AdminButtonsComponent } from '../admin-buttons/admin-buttons.component';
import { ManageMembersService } from '../manage-members-pop-up/manage-members-pop-up.component.service'
import { ManageMembersPopUpComponent } from '../manage-members-pop-up/manage-members-pop-up.component'
import {AuthService} from "../generalServices/auth-service/auth.service";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, AdminButtonsComponent, ManageMembersPopUpComponent],
  providers: [SharedPopupsService],
  templateUrl: './admin-groups.component.html',
  styleUrl: './admin-groups.component.css'
})
export class AdminGroupsComponent  implements OnInit {
  constructor(public manageMembersService: ManageMembersService, public sharedService: SharedPopupsService,
              protected authService: AuthService) {this.addRow();}
  active: number = 4;

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$() .subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
    this.sharedService.manageMembersService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });
  }
  manageMembers() {
    this.manageMembersService.openManageMembersPopup();
  }

  @ViewChild('inputNoActive', { static: false }) inputNoActive!: ElementRef;


  toggleEditMode(inputElement: HTMLInputElement) {
    if (inputElement) {
      const inputId = inputElement.getAttribute('id');

      // Cambiar entre "noactive" y "active"
      const newId = inputId === 'noactive' ? 'active' : 'noactive';
      inputElement.setAttribute('id', newId);

      // Verificar el ID para habilitar o deshabilitar la edición
      if (newId === 'active') {
        inputElement.removeAttribute('readonly'); // Habilitar la edición
      } else {
        inputElement.setAttribute('readonly', 'true'); // Deshabilitar la edición
      }
    }
  }

  originalColor: string = ''; 

  changeColor(event: any) {
    if (event.target.tagName === 'TD') {
      // Verifica si el TD tiene el id "delete-row"
      if (event.target.id !== 'delete-row') {
        // Si no tiene el id "delete-row", llama a deleteRow(i)

      } else {
        // Si tiene el id "delete-row", aplica el cambio de color
        if (event.target.style.backgroundColor !== 'green') {
          this.originalColor = event.target.style.backgroundColor; 
          event.target.style.backgroundColor = 'green';
        } else {
          event.target.style.backgroundColor = this.originalColor;
        }
      }
    }
  }
  

  rows: any[] = []; // Array para almacenar las filas

  // Método para agregar una nueva fila
  addRow() {
    this.rows.push({
      hora_inicio: '', // Inicializamos la hora de inicio
      hora_fin: ''      // Inicializamos la hora de fin
    });
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
  }
}
