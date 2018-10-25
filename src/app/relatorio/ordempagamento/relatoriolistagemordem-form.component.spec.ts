import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioListagemOrdemFormComponent } from './relatoriolistagemordem-form.component';

describe('RelatorioOrdemClienteFormComponent', () => {
  let component: RelatorioListagemOrdemFormComponent;
  let fixture: ComponentFixture<RelatorioListagemOrdemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioListagemOrdemFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioListagemOrdemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
