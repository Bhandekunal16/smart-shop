import { TestBed } from '@angular/core/testing';

import { SettlerService } from './settler.service';

describe('SettlerService', () => {
  let service: SettlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
