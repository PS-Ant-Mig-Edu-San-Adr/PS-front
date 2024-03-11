import { TestBed } from '@angular/core/testing';

import { ManageActivitiesPopUpService } from './manage-activities-pop-up.service';

describe('ManageActivitiesPopUpService', () => {
  let service: ManageActivitiesPopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageActivitiesPopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
