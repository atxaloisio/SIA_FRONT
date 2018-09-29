import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdemPagamentoListComponent } from './ordempagamento-list.component';

describe('OrdemPagamentoComponent', () => {
  let component: OrdemPagamentoListComponent;
  let fixture: ComponentFixture<OrdemPagamentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdemPagamentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdemPagamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
