import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroListagemOrdemPagamentoListComponent } from './filtrolistagemordempagamento-list.component';

describe('FiltroListagemOrdemPagamentoComponent', () => {
  let component: FiltroListagemOrdemPagamentoListComponent;
  let fixture: ComponentFixture<FiltroListagemOrdemPagamentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroListagemOrdemPagamentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroListagemOrdemPagamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
