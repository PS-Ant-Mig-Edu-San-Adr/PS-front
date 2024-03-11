import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAddPopUpComponent } from './group-add-pop-up.component';

describe('GroupAddPopUpComponent', () => {
  let component: GroupAddPopUpComponent;
  let fixture: ComponentFixture<GroupAddPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAddPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupAddPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
