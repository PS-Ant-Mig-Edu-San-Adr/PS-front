import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilNotificationsComponent } from './perfil-notifications.component';

describe('PerfilNotificationsComponent', () => {
  let component: PerfilNotificationsComponent;
  let fixture: ComponentFixture<PerfilNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilNotificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
