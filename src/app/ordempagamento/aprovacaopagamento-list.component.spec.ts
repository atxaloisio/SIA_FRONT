import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovacaoPagamentoListComponent } from './aprovacaopagamento-list.component';

describe('AprovacaoPagamentoComponent', () => {
  let component: AprovacaoPagamentoListComponent;
  let fixture: ComponentFixture<AprovacaoPagamentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprovacaoPagamentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprovacaoPagamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
