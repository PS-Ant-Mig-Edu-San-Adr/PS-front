import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddEventComponent } from './admin-add-event.component';

describe('AdminAddEventComponent', () => {
  let component: AdminAddEventComponent;
  let fixture: ComponentFixture<AdminAddEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAddEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
