import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, viewChild } from '@angular/core';
import { ManageMembersService } from './manage-members-pop-up.component.service';
import { AuthService } from '../generalServices/auth-service/auth.service';
import { SessionStorageService } from 'angular-web-storage';
import { FormsModule } from '@angular/forms';
import { Organization, User } from '../interfaces/interface';

@Component({
  selector: 'app-manage-members-pop-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-members-pop-up.component.html',
  styleUrl: './manage-members-pop-up.component.css'
})

export class ManageMembersPopUpComponent {
  constructor(private manageMembersService: ManageMembersService, private authService: AuthService, private sessionStorage: SessionStorageService) {}
  @ViewChild('inputUserName', { static: false }) inputUsername!: ElementRef<HTMLInputElement>;
  @ViewChild('namesDropdown', { static: false }) namesDropdown!: ElementRef<HTMLSelectElement>;

  users: User[] = [];
  username: string = '';
  inputUser: User | null = null;
  @Input() organization: Organization | null = null;

  ngOnInit() {
    this.username = this.sessionStorage.get('username');
  }

  closeManageMembersPopup() {
    this.manageMembersService.closeManageMembersPopup();
  }

  async filterNames() {
    const filter = this.inputUsername.nativeElement.value.toUpperCase();

    if(this.inputUser){
      this.inputUser = null;
    }

    if (filter.length <= 0) {
      this.namesDropdown.nativeElement.style.display = 'none';
      this.users = [];
      return;
    }
    await this.getFilteredNames(filter);



    if (this.namesDropdown.nativeElement.children.length > 0 || this.users.length > 0) {
      this.namesDropdown.nativeElement.style.display = 'block';
    } else {
      this.namesDropdown.nativeElement.style.display = 'none';
    }
  }

  async getFilteredNames(filter: string) {
    try {
      const res: any = await this.manageMembersService.getFilteredNames(filter).toPromise();
      if (res) {
        this.users = res.users;
      } else {
        this.users = [];
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  userClick(user: User){
    this.inputUsername.nativeElement.value = user.username.toString();
    this.namesDropdown.nativeElement.style.display = 'none';
    this.inputUser = user;
  }

  addUser(){
    if(this.inputUser){
      
    }
  }
}
