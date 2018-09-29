import { TestBed, inject } from '@angular/core/testing';

import { FuncaoService } from './funcao.service';

describe('FuncaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FuncaoService]
    });
  });

  it('should be created', inject([FuncaoService], (service: FuncaoService) => {
    expect(service).toBeTruthy();
  }));
});
