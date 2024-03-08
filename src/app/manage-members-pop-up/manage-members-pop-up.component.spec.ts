import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMembersPopUpComponent } from './manage-members-pop-up.component';

describe('ManageMembersPopUpComponent', () => {
  let component: ManageMembersPopUpComponent;
  let fixture: ComponentFixture<ManageMembersPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMembersPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageMembersPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
