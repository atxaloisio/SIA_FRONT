import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCentroCustoListComponent } from './usuariocentrocusto-list.component';

describe('UsuarioCentroCustoComponent', () => {
  let component: UsuarioCentroCustoListComponent;
  let fixture: ComponentFixture<UsuarioCentroCustoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioCentroCustoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCentroCustoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
