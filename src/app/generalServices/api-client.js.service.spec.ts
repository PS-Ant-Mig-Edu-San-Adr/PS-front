import { TestBed } from '@angular/core/testing';

import { ApiClientJsService } from './api-client.js.service';

describe('ApiClientJsService', () => {
  let service: ApiClientJsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiClientJsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
