import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateOrganizationComponent } from './admin-create-organization.component';

describe('AdminCreateOrganizationComponent', () => {
  let component: AdminCreateOrganizationComponent;
  let fixture: ComponentFixture<AdminCreateOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateOrganizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCreateOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
