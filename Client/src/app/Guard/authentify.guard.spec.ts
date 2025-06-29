import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authentifyGuard } from './authentify.guard';

describe('authentifyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authentifyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
