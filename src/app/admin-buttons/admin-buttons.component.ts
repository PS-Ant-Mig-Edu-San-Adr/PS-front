import { Component, AfterViewInit, Input, ElementRef } from '@angular/core';
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

  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit() {
    const adminButton = this.elementRef.nativeElement.querySelector(`#admin_button_${this.active}`);
    if (adminButton) {
      adminButton.style.fontWeight = "700";
      adminButton.style.boxShadow = "inset -5px 0 0 0 #504136";
    }
  }
}