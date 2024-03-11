import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupAddPopUpService } from './group-add-pop-up.service';

@Component({
  selector: 'app-group-add-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-add-pop-up.component.html',
  styleUrl: './group-add-pop-up.component.css'
})
export class GroupAddPopUpComponent {
  constructor(private addGroup: GroupAddPopUpService) {}

  closeGroupAddPopup() {
    this.addGroup.closeGroupAddPopup();
  }
}
