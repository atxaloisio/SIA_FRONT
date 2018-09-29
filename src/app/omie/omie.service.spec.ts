import { TestBed, inject } from '@angular/core/testing';

import { OmieService } from './omie.service';

describe('OmieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OmieService]
    });
  });

  it('should be created', inject([OmieService], (service: OmieService) => {
    expect(service).toBeTruthy();
  }));
});
