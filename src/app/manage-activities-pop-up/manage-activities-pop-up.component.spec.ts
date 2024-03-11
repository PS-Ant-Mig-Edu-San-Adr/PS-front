import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActivitiesPopUpComponent } from './manage-activities-pop-up.component';

describe('ManageActivitiesPopUpComponent', () => {
  let component: ManageActivitiesPopUpComponent;
  let fixture: ComponentFixture<ManageActivitiesPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageActivitiesPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageActivitiesPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
