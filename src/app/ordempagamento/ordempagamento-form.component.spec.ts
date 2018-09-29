import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdemPagamentoFormComponent } from './ordempagamento-form.component';

describe('OrdemPagamentoFormComponent', () => {
  let component: OrdemPagamentoFormComponent;
  let fixture: ComponentFixture<OrdemPagamentoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdemPagamentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdemPagamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
