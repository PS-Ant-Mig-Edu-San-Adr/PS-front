import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilButtonsComponent } from './perfil-buttons.component';

describe('PerfilButtonsComponent', () => {
  let component: PerfilButtonsComponent;
  let fixture: ComponentFixture<PerfilButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
