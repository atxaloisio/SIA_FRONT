import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioFornecedorFormComponent } from './relatoriofornecedor-form.component';

describe('RelatorioOrdemClienteFormComponent', () => {
  let component: RelatorioFornecedorFormComponent;
  let fixture: ComponentFixture<RelatorioFornecedorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioFornecedorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioFornecedorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
