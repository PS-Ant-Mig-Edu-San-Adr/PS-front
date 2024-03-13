import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { AdminButtonsComponent } from '../admin-buttons/admin-buttons.component';
import { ManageMembersService } from '../manage-members-pop-up/manage-members-pop-up.component.service';
import { ManageMembersPopUpComponent } from '../manage-members-pop-up/manage-members-pop-up.component';
import { AuthService } from "../generalServices/auth-service/auth.service";
import { FormsModule } from '@angular/forms';
import { AdminGroupsDataCollector } from "./admin-groups-data-collector";


@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    RegisterComponent,
    AdminButtonsComponent,
    ManageMembersPopUpComponent
  ],
  providers: [SharedPopupsService],
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.css']
})
export class AdminGroupsComponent implements OnInit {
  constructor(
    public manageMembersService: ManageMembersService,
    public sharedService: SharedPopupsService,
    protected authService: AuthService
  ) {
    this.rows.forEach(row => {
      row.days = this.days.slice(); // Asigna una copia del arreglo 'days' a la propiedad 'days' de cada objeto en 'rows'
    });
  }
  active: number = 4;

  ngOnInit() {
    this.sharedService.authService.isLoginOpen$().subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.authService.isRegisterOpen$().subscribe((success: boolean) => {
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
      if (event.target.id === 'delete-row') {
        return;
      } else {
        this.updateRow(event.target.id);
        if (event.target.style.backgroundColor !== 'green') {
          this.originalColor = event.target.style.backgroundColor;
          event.target.style.backgroundColor = 'green';
        } else {
          event.target.style.backgroundColor = this.originalColor;
        }
      }
    }
  }

  updateRow(targetId: string) {
    let dayIndex = -1;
    switch (targetId) {
      case 'lunes':
        dayIndex = 0;
        break;
      case 'martes':
        dayIndex = 1;
        break;
      case 'miercoles':
        dayIndex = 2;
        break;
      case 'jueves':
        dayIndex = 3;
        break;
      case 'viernes':
        dayIndex = 4;
        break;
      case 'sabado':
        dayIndex = 5;
        break;
      case 'domingo':
        dayIndex = 6;
        break;
      case 'default':
        dayIndex = 7;
        break;
    }
    // Verificar si se encontró un día válido
    if (dayIndex !== -1) {
      // Cambiar el valor booleano asociado al día de la semana
      this.days[dayIndex] = !this.days[dayIndex];
    }
  }

  days: boolean[] = [false, false, false, false, false, false, false];

  rows: any[] = [
    { hora_inicio: '', hora_fin: ''}, // Agrega más propiedades según sea necesario
  ];

  result: any[]  = [];
  i=0;
  // Inicializar el resultado con los valores actuales de rows y days
  initializeResult() {
    if(this.rows.length !== this.result.length ) {
      this.result.push({
        horas: [this.rows[this.i].hora_inicio, this.rows[this.i].hora_fin],
        dias: [...this.days]
      });
      this.i++;
      this.days = [false, false, false, false, false, false, false]; // Resetear todos los valores de this.days a false
    } 
  }

  addRow() {
    // Inicializar un nuevo array de días con valores falsos
    this.initializeResult();
    this.rows.push({
      hora_inicio: '', // Utiliza la última hora de inicio en la matriz
      hora_fin: '', // Utiliza la última hora de fin en la matriz
    });
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
  }

  actualizarTabla() {}

  onModifyUserClick(): void {
    this.initializeResult();
    const userData = AdminGroupsDataCollector.collectEventData(this.result);
    console.log(userData);
    if (!userData.result) {
      
      alert(userData.details);
      return;
    }
  }
}
