import { TestBed } from '@angular/core/testing';

import { SharedPopupsService } from './sharedPopups.service';

describe('SharedService', () => {
  let service: SharedPopupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedPopupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
