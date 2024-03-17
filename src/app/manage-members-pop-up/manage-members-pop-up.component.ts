import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, viewChild } from '@angular/core';
import { ManageMembersService } from './manage-members-pop-up.component.service';
import { AuthService } from '../generalServices/auth-service/auth.service';
import { SessionStorageService } from 'angular-web-storage';
import { FormsModule } from '@angular/forms';
import { Activity, Group, Member, Organization, User } from '../interfaces/interface';
import { OrganizationService } from '../generalServices/organization.service';
import { ActivityService } from '../generalServices/activity.service';
import { GroupService } from '../generalServices/group.service';

@Component({
  selector: 'app-manage-members-pop-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-members-pop-up.component.html',
  styleUrl: './manage-members-pop-up.component.css'
})

export class ManageMembersPopUpComponent {
  constructor(private manageMembersService: ManageMembersService, private authService: AuthService, 
    private sessionStorage: SessionStorageService, private organizationService: OrganizationService,
    private activityService: ActivityService, private groupService: GroupService) {}
  @ViewChild('inputUserName', { static: false }) inputUsername!: ElementRef<HTMLInputElement>;
  @ViewChild('namesDropdown', { static: false }) namesDropdown!: ElementRef<HTMLSelectElement>;
  @ViewChild('icono', { static: false }) icono!: ElementRef<HTMLElement>;

  users: User[] = [];
  username: string = '';
  inputUser: User | null = null;
  usersAdded: Member[] = [];

  @Input() organization: Organization | undefined;
  @Input() activity: Activity | undefined;
  @Input() group: Group | undefined;

  ngOnInit() {
    this.username = this.sessionStorage.get('username');
    if(this.organization && !this.activity && !this.group){
      this.usersAdded = this.organization.members;
    }else if(this.activity && this.organization && !this.group){
      this.usersAdded = this.activity.members;
    }else if(this.group && this.activity && this.organization){
      this.usersAdded = this.group.members;
    }
  }

  closeManageMembersPopup() {
    this.manageMembersService.closeManageMembersPopup();
  }

  async filterNames() {
    const filter = this.inputUsername.nativeElement.value.toUpperCase();

    if(this.inputUser){
      this.inputUser = null;
      this.icono.nativeElement.className = 'fa-solid fa-plus';
      this.icono.nativeElement.style.display = 'block';
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
  
  userClick(user: User) {
    this.inputUsername.nativeElement.value = user.username.toString();
    this.namesDropdown.nativeElement.style.display = 'none';
    this.inputUser = user;
  
    const result = this.checkOrganizationMembership(this.inputUser);
  
    if (result) {
      if (!this.checkIfUserIsAdmin(this.inputUser)) {
        this.icono.nativeElement.onclick = this.removeUser.bind(this);
        this.icono.nativeElement.className = 'fa-solid fa-minus';
      } else {
        this.icono.nativeElement.style.display = 'none';
      }
    } else {
      this.icono.nativeElement.onclick = this.addUser.bind(this);
      this.icono.nativeElement.className = 'fa-solid fa-plus';
      this.icono.nativeElement.style.display = 'block';
    }
  }
  
  addUser() {
    if (this.organization || this.activity || this.group) {
      const newMember: Member = {
        name: this.inputUser?.fullName || '',
        _id: this.inputUser?._id || '',
        email: this.inputUser?.email || '',
        role: 'member',
        username: this.inputUser?.username || ''
      };
    
      this.usersAdded.push(newMember);
      
      this.modifyMembers();
    }
  }
  
  removeUser() {
    this.usersAdded = this.usersAdded.filter(member => member.username !== this.inputUser?.username);

    this.modifyMembers();
  }

  modifyMembers() {

    const body = {
      members: this.usersAdded
    };

    if (this.organization && !this.activity && !this.group) {
      
      this.organizationService.putOrganization(this.organization, body).subscribe((res) => {
        if (res) {
          console.log('Usuario añadido');
        } else {
          console.log('Error al añadir usuario');
        }
      });
    } else if (this.activity && this.organization && !this.group) {

      this.activityService.updateMembersActivity(this.organization?._id, this.activity?._id, body).subscribe((res) => {
        if (res) {
          console.log('Usuario añadido');
        } else {
          console.log('Error al añadir usuario');
        }
      });
    } else {
      if (this.group && this.activity && this.organization) {

        this.groupService.putGroupMembers(this.organization._id, this.activity._id, this.group._id, body).subscribe((res) => {
          if (res) {
            console.log('Usuario añadido');
          } else {
            console.log('Error al añadir usuario');
          }
        });
      }
    }
  }

  changeRole(member: Member, RolSelect: any) {
    member.role = RolSelect.target.value;
    this.modifyMembers();
  }

  checkIfUserIsAdmin(user: User | Member) : boolean{
    return this.usersAdded.filter(member => member.username === user.username)[0].role === 'admin';
  
  }

  checkOrganizationMembership(user: User) : boolean{
    return this.usersAdded.filter(member => member.username === user.username).length > 0;
  }
}
