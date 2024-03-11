import { Component, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-buttons.component.html',
  styleUrl: './admin-buttons.component.css'
})
export class AdminButtonsComponent implements AfterViewInit {

  @Input() active: number = 0;

  ngAfterViewInit() {
    const adminButton = document.getElementById(`admin_button_${this.active}`) as HTMLElement;
      // Ahora puedes usar adminButton para manipular el elemento
      adminButton.style.fontWeight = "700";
      adminButton.style.boxShadow = "inset -5px 0 0 0 #504136";
  }
}