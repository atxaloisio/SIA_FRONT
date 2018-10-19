import { TestBed, inject } from '@angular/core/testing';

import { UsuarioCentroCustoService } from './usuariocentrocusto.service';

describe('UsuarioCentroCustoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuarioCentroCustoService]
    });
  });

  it('should be created', inject([UsuarioCentroCustoService], (service: UsuarioCentroCustoService) => {
    expect(service).toBeTruthy();
  }));
});
