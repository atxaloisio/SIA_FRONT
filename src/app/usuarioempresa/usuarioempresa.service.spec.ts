import { TestBed, inject } from '@angular/core/testing';

import { UsuarioEmpresaService } from './usuarioempresa.service';

describe('UsuarioEmpresaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuarioEmpresaService]
    });
  });

  it('should be created', inject([UsuarioEmpresaService], (service: UsuarioEmpresaService) => {
    expect(service).toBeTruthy();
  }));
});
