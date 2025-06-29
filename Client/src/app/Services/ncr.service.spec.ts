import { TestBed } from '@angular/core/testing';

import { NcrService } from './ncr.service';

describe('NcrService', () => {
  let service: NcrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NcrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
