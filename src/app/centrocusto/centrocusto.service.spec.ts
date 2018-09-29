import { TestBed, inject } from '@angular/core/testing';

import { CentroCustoService } from './centrocusto.service';

describe('CentroCustoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentroCustoService]
    });
  });

  it('should be created', inject([CentroCustoService], (service: CentroCustoService) => {
    expect(service).toBeTruthy();
  }));
});
