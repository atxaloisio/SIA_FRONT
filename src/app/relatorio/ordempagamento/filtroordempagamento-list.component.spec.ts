import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroOrdemPagamentoListComponent } from './filtroordempagamento-list.component';

describe('FiltroOrdemPagamentoComponent', () => {
  let component: FiltroOrdemPagamentoListComponent;
  let fixture: ComponentFixture<FiltroOrdemPagamentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroOrdemPagamentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroOrdemPagamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
