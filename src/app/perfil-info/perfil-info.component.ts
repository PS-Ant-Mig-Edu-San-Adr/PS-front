import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { SharedPopupsService } from '../generalServices/sharedPopups.service';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginService } from '../login/login.component.service';
import { RegisterService } from '../register/register.component.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { PerfilButtonsComponent } from '../perfil-buttons/perfil-buttons.component'
import { User } from '../interfaces/interface';
import { PerfilInfoDataCollector } from './perfil-info-data-collector';
import { SessionStorageService } from 'angular-web-storage';
import { PerfilInfoService } from './perfil-info.component.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-perfil-info',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoginComponent, FooterComponent, RegisterComponent, PerfilButtonsComponent, FormsModule],
  providers: [SharedPopupsService],
  templateUrl: './perfil-info.component.html',
  styleUrl: './perfil-info.component.css'
  
})
export class PerfilInfoComponent implements OnInit, AfterViewInit {
  constructor(public sharedService: SharedPopupsService, 
    public loginService: LoginService, 
    public registerService: RegisterService, 
    public sessionStorageService: SessionStorageService,
    public perfilInfoService: PerfilInfoService
  ) {}

  @ViewChild('inputUserName', { static: false }) inputUsername!: ElementRef<HTMLInputElement>;
  @ViewChild('inputEmail', { static: false }) inputEmail!: ElementRef<HTMLInputElement>;
  @ViewChild('inputPassword', { static: false }) inputPassword!: ElementRef<HTMLInputElement>;
  @ViewChild('inputDate', { static: false }) inputDate!: ElementRef<HTMLInputElement>;
  @ViewChild('inputZone', { static: false }) inputZone!: ElementRef<HTMLSelectElement>;
  @ViewChild('inputNoActive', { static: false }) inputNoActive!: ElementRef;

  active: number = 0;
  user: User | undefined;
  profilePict: string = '';
  selectedTimeZone: string = 'GMT';
  filePicture: File | undefined;
  
  ngOnInit() {
    this.sharedService.loginService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.sharedService.registerService.isOpen$.subscribe((success: boolean) => {
      this.sharedService.toggleWrapperContainerStyles(success);
    });

    this.profilePict = this.sessionStorageService.get('profilePict');

    this.perfilInfoService.getUser(this.sessionStorageService.get('username')).subscribe((user: User | undefined) => {
      this.user = user;
      this.loadInputs();
    });
  }

  
  ngAfterViewInit() {
    this.loadInputs();
  }

  loadInputs() {
    if (this.inputUsername) {
      this.inputUsername.nativeElement.value = (this.user?.username || '').toString();
    }
    if (this.inputEmail) {
      this.inputEmail.nativeElement.value = (this.user?.email || '').toString();
    }
    if (this.inputDate) {
      const originalDate = (this.user?.creationDate || '').toString().split('T')[0];
      this.inputDate.nativeElement.value = (originalDate || '').toString();
    }
    if (this.inputZone) {
      this.selectedTimeZone = (this.user?.timeZone || 'GMT').toString();

    }
  }

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

  generateUniqueFileName(file: File): string {
    const timestamp = new Date().getTime();
    const originalFileName = file.name;
    const fileExtension = originalFileName.split('.').pop();
    const uniqueFileName = `${timestamp}_${this.randomString(10)}.${fileExtension}`;
    return uniqueFileName;
  }

  randomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  onFileSelected(event: Event){
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      const modifiedFile = this.renameFile(file);
      this.filePicture = modifiedFile;
      this.profilePict = URL.createObjectURL(modifiedFile);
    }
    
  }

  renameFile(file: File): File {
    const uniqueFileName = this.generateUniqueFileName(file);
    return new File([file], uniqueFileName, { type: file.type });
  }

  onModifyUserClick(): void {
    const userData = PerfilInfoDataCollector.collectUserData(this.user as User, this.filePicture);

    if (!userData.result) {
      alert(userData.details);
      return;
    }

    const username = this.user?.username;
    if (!username) {
      alert('Please log in before modifying your profile.');
      return;
    }
    
    this.perfilInfoService.putUser(
        this.sessionStorageService.get('username'), 
        this.inputUsername.nativeElement.value, 
        this.inputEmail.nativeElement.value, 
        this.inputZone.nativeElement.value, 
        this.inputPassword.nativeElement.value,
        this.filePicture
      ).subscribe((res) => {
      if (res) {
        alert('Profile modified successfully.');
      } else {
        alert('There was an error modifying your profile.');
      }
    });

  }
}
