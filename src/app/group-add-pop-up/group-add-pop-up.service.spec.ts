import { TestBed } from '@angular/core/testing';

import { GroupAddPopUpService } from './group-add-pop-up.service';

describe('GroupAddPopUpService', () => {
  let service: GroupAddPopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupAddPopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
