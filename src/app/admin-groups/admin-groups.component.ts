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
import {Group, User} from "../interfaces/interface";
import {SessionStorageService} from 'angular-web-storage';

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
    private sessionStorageService: SessionStorageService,
    protected authService: AuthService
  ) {
    
  }
  active: number = 4;
  user: User | undefined;
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
    this.authService.getUser(this.sessionStorageService.get('username')).subscribe((user: User | undefined) => {
      this.user = user;
    });
  }
  manageMembers() {
    this.manageMembersService.openManageMembersPopup();
  }

  @ViewChild('inputNoActive', { static: false }) inputNoActive!: ElementRef;

  toggleEditMode(inputElement: HTMLInputElement) {
    if (inputElement) {
      const inputClass = inputElement.getAttribute('class');

      // Cambiar entre "noactive" y "active"
      const newClass = inputClass === 'noactive' ? 'active' : 'noactive';
      inputElement.setAttribute('class', newClass);

      // Verificar el ID para habilitar o deshabilitar la edición
      if (newClass === 'active') {
        inputElement.removeAttribute('readonly'); // Habilitar la edición
      } else {
        inputElement.setAttribute('readonly', 'true'); // Deshabilitar la edición
      }
    }
  }

  originalColor: string = '';

  updateTable(event: any, index: number) {
    if (event.target.tagName === 'TD') {
      if (event.target.id === 'delete-row') {
        return;
      } else {
        this.updateRow(event.target.id, index);
        if (event.target.style.backgroundColor !== 'green') {
          this.originalColor = event.target.style.backgroundColor;
          event.target.style.backgroundColor = 'green';
        } else {
          event.target.style.backgroundColor = this.originalColor;
        }
      }
    }
  }

  updateRow(targetId: string, index: number) {
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
      this.result[index].dias[dayIndex] = !this.result[index].dias[dayIndex]
    }
  }

  days: boolean[] = [false, false, false, false, false, false, false];

  rows: any[] = [
    { startTime: '', endTime: ''},
  ];

  result: any[] = this.rows.map(row => ({
    horas: {startTime:  '', endTime: ''},
    dias: [...this.days]
  }));

  updateTime() {
    for(let index = 0; index <  this.rows.length ; ++index){
      this.result[index].horas.startTime = this.rows[index].startTime
      this.result[index].horas.endTime = this.rows[index].endTime
    }
  }

  addRow() {
    this.rows.push({
      startTime: '', 
      endTime: '', 
    });
    this.result.push({
      horas: {startTime:  '', endTime: ''},
      dias: [...this.days]
    })
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
    this.result.splice(index, 1);
  }

  putGroup(): void {
    this.updateTime()
    const userData = AdminGroupsDataCollector.collectEventData(this.result);
    if (!userData.result) {
      alert(userData.details);
      return;
    }

    const username = this.user?.username;
    if (!username) {
      alert('Please log in before modifying.');
      return;
    }
/* 
    this.groupService.putGroup(userData.result).subscribe((res: any) => {
      if (res) {
        alert(res.details);
      } else {
        alert('Error updating organization.');
      }
    })

*/

  }
}
