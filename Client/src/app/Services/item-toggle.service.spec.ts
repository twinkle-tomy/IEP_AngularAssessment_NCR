import { TestBed } from '@angular/core/testing';

import { ItemToggleService } from './item-toggle.service';

describe('ItemToggleService', () => {
  let service: ItemToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
