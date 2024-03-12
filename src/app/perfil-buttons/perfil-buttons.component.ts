import { Component, AfterViewInit, Input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
;

@Component({
  selector: 'app-perfil-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-buttons.component.html',
  styleUrl: './perfil-buttons.component.css'
})
export class PerfilButtonsComponent implements AfterViewInit  {

  @Input() active: number = 0;

  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit() {
    const perfilButton = this.elementRef.nativeElement.querySelector(`#perfil_info_${this.active}`);
    if (perfilButton) {
      perfilButton.style.fontWeight = "bolder";
      perfilButton.style.borderRight = "4px solid var(--mainColor)";
    }
  }
}
