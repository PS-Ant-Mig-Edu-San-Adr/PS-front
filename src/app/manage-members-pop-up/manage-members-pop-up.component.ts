import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ManageMembersService } from '../manage-members-pop-up/manage-members-pop-up.component.service';

@Component({
  selector: 'app-manage-members-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-members-pop-up.component.html',
  styleUrl: './manage-members-pop-up.component.css'
})

export class ManageMembersPopUpComponent {
  constructor(private manageMembersService: ManageMembersService) {}

  closeManageMembersPopup() {
    this.manageMembersService.closeManageMembersPopup();
  }
}
