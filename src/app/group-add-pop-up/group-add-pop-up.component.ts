import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupAddPopUpService } from './group-add-pop-up.service';
import { Activity, Organization, User } from '../interfaces/interface';
import { GroupService } from '../generalServices/group.service';

@Component({
  selector: 'app-group-add-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-add-pop-up.component.html',
  styleUrl: './group-add-pop-up.component.css'
})
export class GroupAddPopUpComponent {
  constructor(private addGroupService: GroupAddPopUpService, private groupService: GroupService) {}
  @Input() activity: Activity | undefined = undefined;
  @Input() user: User | undefined = undefined;
  @Input() organization: Organization | undefined = undefined;

  @ViewChild('name') name: ElementRef | undefined;
  @ViewChild('description') description: ElementRef | undefined;
  @ViewChild('privacy') privacy: ElementRef | undefined;

  addGroup() {
    if (this.checkIfEmpty() && this.user && this.activity && this.organization) {
      if (this.checkIfNameExists()) {
        alert('Group with this name already exists');
      } else {
        const members = this.activity?.members?.filter(member => member._id === this.user?._id) ?? [];
        this.groupService.postGroup(this.organization?._id ,this.activity?._id, this.name?.nativeElement.value, this.description?.nativeElement.value, this.privacy?.nativeElement.value, members).subscribe((res) => {
          if (res) {
            if(res.status === 200){
              this.addGroupService.closeGroupAddPopup();
            }else{
              alert(res.details)
            }
            
          } else {
            alert('Error adding group');
          }
        });
      }
    } else {
      alert('Please fill in all fields');
    }
  }

  closeGroupAddPopup() {
    this.addGroupService.closeGroupAddPopup();
  }

  checkIfNameExists() {
    if (this.activity?.groups.find(group => group.name === this.name?.nativeElement.value)) {
      return true;
    }
    return false;
  }
  
  checkIfEmpty() {
    if (this.name?.nativeElement.value && this.description?.nativeElement.value && this.privacy?.nativeElement.value) {
      return true;
    }
    return false;
  }
}
