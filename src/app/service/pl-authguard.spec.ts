import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { PlAuthguard } from './pl-authguard'

describe('PlAuthguard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => PlAuthguard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
