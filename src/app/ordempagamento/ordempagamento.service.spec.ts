import { TestBed, inject } from '@angular/core/testing';

import { OrdemPagamentoService } from './ordempagamento.service';

describe('OrdemPagamentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdemPagamentoService]
    });
  });

  it('should be created', inject([OrdemPagamentoService], (service: OrdemPagamentoService) => {
    expect(service).toBeTruthy();
  }));
});
