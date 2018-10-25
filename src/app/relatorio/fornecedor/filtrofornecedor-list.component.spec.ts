import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroFornecedorListComponent } from './filtrofornecedor-list.component';

describe('FiltroFornecedorComponent', () => {
  let component: FiltroFornecedorListComponent;
  let fixture: ComponentFixture<FiltroFornecedorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroFornecedorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroFornecedorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
