import { TestBed } from '@angular/core/testing';

import { LogoutGuardService } from './logout-guard.service';

describe('LogoutGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogoutGuardService = TestBed.get(LogoutGuardService);
    expect(service).toBeTruthy();
  });
});
